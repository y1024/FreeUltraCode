import { useEffect, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import type { ScheduledTaskConfig, ScheduledTaskWeekday, Session } from '@/store/types';

const SCHEDULE_CHECK_MS = 1000;
const SCHEDULE_DUE_WINDOW_MS = 1800;

const firedScheduleKeys = new Set<string>();

interface ScheduledSession {
  session: Session;
  workspaceId: string | null;
  scheduledTask: ScheduledTaskConfig;
}

function localDateStamp(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isTaskDue(task: ScheduledTaskConfig, now: Date): boolean {
  if (!task.enabled) return false;
  if (!task.weekdays.includes(now.getDay() as ScheduledTaskWeekday)) {
    return false;
  }
  const scheduled = new Date(now);
  scheduled.setHours(task.hour, task.minute, task.second, 0);
  const delta = now.getTime() - scheduled.getTime();
  return delta >= 0 && delta < SCHEDULE_DUE_WINDOW_MS;
}

function scheduleFireKey(
  sessionId: string,
  workspaceId: string | null,
  task: ScheduledTaskConfig,
  now: Date,
): string {
  return [
    workspaceId ?? '',
    sessionId,
    localDateStamp(now),
    task.hour,
    task.minute,
    task.second,
  ].join(':');
}

function nextRunTask(
  task: ScheduledTaskConfig,
  now: Date,
): ScheduledTaskConfig {
  const timestamp = now.getTime();
  return {
    ...task,
    enabled: task.repeat ? task.enabled : false,
    lastRunAt: timestamp,
    updatedAt: timestamp,
  };
}

export default function ScheduledTaskRunner() {
  const sessions = useStore((s) => s.sessions);
  const workspaces = useStore((s) => s.workspaces);
  const sessionTree = useStore((s) => s.sessionTree);
  const activeWorkspaceId = useStore((s) => s.activeWorkspaceId);
  const setWorkflowScheduledTaskSession = useStore(
    (s) => s.setWorkflowScheduledTaskSession,
  );
  const runScheduledTaskSession = useStore((s) => s.runScheduledTaskSession);

  const scheduledSessions = useMemo<ScheduledSession[]>(() => {
    const source =
      workspaces.length > 0
        ? workspaces.flatMap((workspace) =>
            (sessionTree[workspace.id] ?? []).map((session) => ({
              session,
              workspaceId: session.workspaceId ?? workspace.id,
            })),
          )
        : sessions.map((session) => ({
            session,
            workspaceId: session.workspaceId ?? activeWorkspaceId ?? null,
          }));

    return source.flatMap(({ session, workspaceId }) => {
      const scheduledTask = session.scheduledTask;
      if (!session.favorite || !scheduledTask?.enabled) return [];
      return [{ session, workspaceId, scheduledTask }];
    });
  }, [activeWorkspaceId, sessions, sessionTree, workspaces]);

  useEffect(() => {
    const checkSchedules = () => {
      const now = new Date();
      for (const { session, workspaceId, scheduledTask } of scheduledSessions) {
        if (!isTaskDue(scheduledTask, now)) continue;
        const fireKey = scheduleFireKey(
          session.id,
          workspaceId,
          scheduledTask,
          now,
        );
        if (firedScheduleKeys.has(fireKey)) continue;
        firedScheduleKeys.add(fireKey);
        void (async () => {
          await setWorkflowScheduledTaskSession(
            session.id,
            workspaceId,
            nextRunTask(scheduledTask, now),
          );
          await runScheduledTaskSession(session.id, workspaceId, scheduledTask);
        })().catch(() => {});
      }
    };

    checkSchedules();
    const timer = window.setInterval(checkSchedules, SCHEDULE_CHECK_MS);
    return () => window.clearInterval(timer);
  }, [
    runScheduledTaskSession,
    scheduledSessions,
    setWorkflowScheduledTaskSession,
  ]);

  return null;
}

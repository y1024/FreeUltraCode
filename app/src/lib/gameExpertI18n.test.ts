import { describe, expect, it } from 'vitest';
import { SUPPORTED_LOCALES } from './i18n';
import { GAME_EXPERTS, type GameExpertDefinition } from './gameExperts';
import {
  localizedGameExpertName,
  localizedGameExpertGroup,
} from './gameExpertI18n';

describe('gameExpertI18n', () => {
  it('has a localized name in every locale for every built-in expert', () => {
    for (const expert of GAME_EXPERTS) {
      for (const locale of SUPPORTED_LOCALES) {
        const name = localizedGameExpertName(expert, locale);
        expect(name, `${expert.id} @ ${locale}`).toBeTruthy();
      }
    }
  });

  it('has a localized group label in every locale for every built-in expert', () => {
    for (const expert of GAME_EXPERTS) {
      for (const locale of SUPPORTED_LOCALES) {
        const group = localizedGameExpertGroup(expert, locale);
        expect(group, `${expert.id} group @ ${locale}`).toBeTruthy();
      }
    }
  });

  it('translates a known expert name across locales', () => {
    const director = GAME_EXPERTS.find((e) => e.id === 'technical-director')!;
    expect(localizedGameExpertName(director, 'zh-CN')).toBe('技术总监');
    expect(localizedGameExpertName(director, 'en-US')).toBe('Technical Director');
    expect(localizedGameExpertName(director, 'ja-JP')).toBe('テクニカルディレクター');
  });

  it('falls back to the raw name and group for unknown (custom) experts', () => {
    const custom: GameExpertDefinition = {
      id: 'my-custom-expert',
      name: 'My Custom Expert',
      group: 'My Group',
      summary: '',
      role: '',
      triggers: [],
      guidance: [],
      boundaries: [],
      defaultRank: 99,
    };
    expect(localizedGameExpertName(custom, 'zh-CN')).toBe('My Custom Expert');
    expect(localizedGameExpertGroup(custom, 'fr-FR')).toBe('My Group');
  });
});

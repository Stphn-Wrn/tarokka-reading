import { MODULE_ID } from "./constants.js";
import { emptyPlan, flip, hiddenStages, placeNext, publicReading, resolveReading, revealAll } from "./reading.js";

const EMPTY_SECRET = { id: null, cards: [], stages: [] };

export class TarokkaState {
  static getPublic() {
    return game.settings.get(MODULE_ID, "reading");
  }

  static getPlan() {
    const plan = game.settings.get(MODULE_ID, "plan");
    if (!Array.isArray(plan) || plan.length === 0) {
      return emptyPlan();
    }
    return plan;
  }

  static getSecret() {
    return { ...EMPTY_SECRET, ...game.settings.get(MODULE_ID, "secret") };
  }

  static async savePlan(plan) {
    await game.settings.set(MODULE_ID, "plan", plan);
  }

  static async deal() {
    if (!game.user.isGM) {
      return;
    }
    const cards = resolveReading(this.getPlan(), Math.random);
    await this.publish({ id: foundry.utils.randomID(), cards, stages: hiddenStages() });
  }

  static async placeNext() {
    await this.update(placeNext);
  }

  static async flip(index) {
    await this.update((stages) => flip(stages, index));
  }

  static async revealAll() {
    await this.update(revealAll);
  }

  static async update(change) {
    const secret = this.getSecret();
    if (!game.user.isGM || !secret.id) {
      return;
    }
    await this.publish({ ...secret, stages: change(secret.stages) });
  }

  static async reset() {
    if (!game.user.isGM) {
      return;
    }
    await game.settings.set(MODULE_ID, "secret", EMPTY_SECRET);
    await game.settings.set(MODULE_ID, "reading", { id: null, positions: [] });
  }

  static async publish(secret) {
    await game.settings.set(MODULE_ID, "secret", secret);
    await game.settings.set(MODULE_ID, "reading", { id: secret.id, positions: publicReading(secret.cards, secret.stages) });
  }
}

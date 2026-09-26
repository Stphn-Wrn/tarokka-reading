import { MODULE_ID } from "./constants.js";
import { emptyPlan, flip, hiddenStages, placeNext, publicReading, resolveReading, sharedReading } from "./reading.js";

const EMPTY_SECRET = { id: null, broadcast: false, cards: [], stages: [] };

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

  static getGmView() {
    const secret = this.getSecret();
    return { id: secret.id, broadcast: secret.broadcast, positions: publicReading(secret.cards, secret.stages) };
  }

  static async savePlan(plan) {
    await game.settings.set(MODULE_ID, "plan", plan);
  }

  static async deal() {
    if (!game.user.isGM) {
      return;
    }
    const cards = resolveReading(this.getPlan(), Math.random);
    const secret = this.getSecret();
    await this.publish({ ...secret, id: foundry.utils.randomID(), cards, stages: hiddenStages() });
  }

  static async placeNext() {
    await this.update(placeNext);
  }

  static async flip(index) {
    await this.update((stages) => flip(stages, index));
  }

  static async update(change) {
    const secret = this.getSecret();
    if (!game.user.isGM || !secret.id) {
      return;
    }
    await this.publish({ ...secret, stages: change(secret.stages) });
  }

  static async setBroadcast(broadcast) {
    if (!game.user.isGM) {
      return;
    }
    await this.publish({ ...this.getSecret(), broadcast });
  }

  static async publish(secret) {
    await game.settings.set(MODULE_ID, "secret", secret);
    await game.settings.set(MODULE_ID, "reading", sharedReading(secret));
  }
}

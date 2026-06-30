import { Firestore } from "@google-cloud/firestore";

export class AgentMemory {
  private db: Firestore;

  constructor() {
    this.db = new Firestore();
  }

  async saveAgentMemory(userId: string, buildId: string, role: string, memory: any) {
    const docRef = this.db.collection('users').doc(userId).collection('agent_memories').doc(`${buildId}_${role}`);
    await docRef.set({
      userId,
      buildId,
      role,
      memory,
      timestamp: Date.now()
    });
  }

  async saveAgentMessage(userId: string, buildId: string, sender: string, receiver: string, content: string, metadata?: any) {
    const docRef = this.db.collection('users').doc(userId).collection('agent_messages').doc();
    await docRef.set({
      userId,
      buildId,
      sender,
      receiver,
      content,
      timestamp: Date.now(),
      metadata
    });
  }

  async getAgentMessages(userId: string, buildId: string, limit: number = 50) {
    const snapshot = await this.db.collection('users').doc(userId)
      .collection('agent_messages')
      .where('buildId', '==', buildId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
    
    return snapshot.docs.map(doc => doc.data());
  }

  async getRecentMemories(userId: string, limit: number = 10) {
    const snapshot = await this.db.collection('users').doc(userId)
      .collection('agent_memories')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
    
    return snapshot.docs.map(doc => doc.data());
  }
}

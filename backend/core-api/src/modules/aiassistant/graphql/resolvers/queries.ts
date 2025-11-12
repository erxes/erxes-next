import { healthCheck } from '../../utils/ragService';
import { RagInteractions } from '../../db/models/RagInteractions';

export const queryResolvers = {
  async ragHealthCheck() {
    return await healthCheck();
  },

  async ragInteractions(_root, { userId, orgId, limit = 10 }, { user }) {
    const query: any = {};
    
    if (userId) {
      query.userId = userId;
    } else {
      query.userId = user._id;
    }
    
    if (orgId) {
      query.orgId = orgId;
    }
    
    return RagInteractions.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);
  }
};
const axios = require('axios');

class ContainerApiService {
  constructor() {
    this.apiUrl = process.env.EXTERNAL_API_URL || 'http://apiedepottest.gsotgroup.vn';
    this.token = null;
    this.reqtime = null;
  }

  async getToken() {
    try {
      console.log('Calling API to get token for GetListReUse_Now...');
      const response = await axios.get(`${this.apiUrl}/api/data/util/gettokenNonAid`, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          reqid: "GetListReUse_Now",
          data: {
            appversion: '2023'
          }
        }
      });

      if (response.data && response.data.token && response.data.reqtime) {
        this.token = response.data.token;
        this.reqtime = response.data.reqtime;
        console.log('Token retrieved successfully');
        return true;
      } else {
        console.error('Invalid token response');
        return false;
      }
    } catch (error) {
      console.error('Failed to get token:', error);
      return false;
    }
  }

  async getListReUseNow() {
    try {
      if (!this.token || !this.reqtime) {
        console.log('Token not available, getting new token...');
        const tokenSuccess = await this.getToken();
        if (!tokenSuccess) {
          throw new Error('Failed to get token');
        }
      }

      console.log('Calling API to get reuse container list...');
      const response = await axios.get(`${this.apiUrl}/api/data/process/GetListReUse_Now`, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          token: this.token,
          reqtime: this.reqtime,
          data: {
            appversion: '2023'
          }
        }
      });

      if (response.data) {
        console.log('Reuse container list retrieved successfully');
        return response.data;
      } else {
        console.error('Invalid data response');
        return null;
      }
    } catch (error) {
      console.error('Failed to get reuse container list:', error);
      // Nếu lỗi 401/403, thử lấy token mới
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('Token expired, getting new token...');
        const tokenSuccess = await this.getToken();
        if (tokenSuccess) {
          return await this.getListReUseNow();
        }
      }
      return null;
    }
  }
}

module.exports = { ContainerApiService };

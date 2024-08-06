import axios from "./axios";

export const login = async (data: any) => {
  try {
    const res = await axios.post(`auth/login`, data);

    return res;
  } catch (error: any) {
    console.log("error in login api", error);
    throw new Error(error);
  }
};

export const googleLogin = async (data: any) => {
  try {
    const res = await axios.post(`auth/google/login`, data);

    return res;
  } catch (error: any) {
    console.log("error in login api", error);
    throw new Error(error);
  }
};

export const signup = async (data: any) => {
  try {
    const res = await axios.post(`auth/signup`, data);

    return res;
  } catch (error: any) {
    console.log("error in signup api", error);
    throw new Error(error?.response?.data?.errorMessage || "internal error");
  }
};

export const forgotPassword = async (data: any) => {
  try {
    const res = await axios.post(`auth/forgotPassword`, data);

    return res;
  } catch (error: any) {
    console.log("error in forgotPassword api", error);
    throw new Error(error);
  }
};

export const verification = async (data: any, token: any) => {
  try {
    const res = await axios.post(`auth/verification`, data, {
      headers: { Authorization: `Bearer ${JSON.parse(token)}` },
    });

    return res;
  } catch (error: any) {
    console.log("error in verification api", error);
    throw new Error(error);
  }
};
export const resetPassword = async (data: any, token: any) => {
  try {
    const res = await axios.post(`auth/resetPassword`, data, {
      headers: { Authorization: `Bearer ${JSON.parse(token)}` },
    });

    return res;
  } catch (error: any) {
    console.log("error in resetPassword api", error);
    throw new Error(error);
  }
};

export const resendOtp = async (token: any) => {
  try {
    const res = await axios.get(`auth/verify/resendOtp`, {
      headers: { Authorization: `Bearer ${JSON.parse(token)}` },
    });

    return res;
  } catch (error: any) {
    console.log("error in resendOtp api", error);
    throw new Error(error);
  }
};

export const updateProfile = async (data: any) => {
  try {
    const res = await axios.patch(`user/profile`, data);

    return res;
  } catch (error: any) {
    console.log("error in verification api", error);
    throw new Error(error);
  }
};
export const changePassword = async (data: any) => {
  try {
    const res = await axios.post(`user/changePassword`, data);

    return res;
  } catch (error: any) {
    console.log("error in changePassword api", error);
    throw new Error(error);
  }
};

export const profile = async (id?: any) => {
  let url = `user/profile`;
  if (id) {
    url += `?id=${id}`;
  }
  try {
    const res = await axios.get(url);

    return res;
  } catch (error: any) {
    console.log("error in profile api", error);
    throw new Error(error);
  }
};

export const createFeed = async (data: any) => {
  try {
    const res = await axios.post(`feed`, data);

    return res;
  } catch (error: any) {
    console.log("error in createFeed api", error);
    throw new Error(error);
  }
};
export const updateFeed = async (data: any) => {
  try {
    const res = await axios.patch(`feed`, data);

    return res;
  } catch (error: any) {
    console.log("error in createFeed api", error);
    // throw new Error(error);
    return false;
  }
};

export const feedList = async (data: any) => {
  let { limit = 10, offset = 0, userId = null } = data;
  let url = `feeds?limit=${limit}&offset=${offset}`;
  if (userId) {
    url += `&userId=${userId}`;
  }

  try {
    const res = await axios.get(url);

    return res;
  } catch (error: any) {
    console.log("error in feedList api", error);
    if (error.response.status == 404) {
      throw new Error("404");
    }
    throw new Error(error);
  }
};

export const feedSavedList = async (data: any) => {
  let { limit = 10, offset = 0, userId = null } = data;
  let url = `feed/saved?limit=${limit}&offset=${offset}`;

  try {
    const res = await axios.get(url);

    return res;
  } catch (error: any) {
    console.log("error in feedList api", error);
    if (error.response.status == 404) {
      throw new Error("404");
    }
    throw new Error(error);
  }
};

export const likeDislike = async (id: any) => {
  try {
    const res = await axios.post(`feed/${id}/like`);

    return res;
  } catch (error: any) {
    console.log("error in createFeed api", error);
    // throw new Error(error);
    return false;
  }
};
export const saveFeed = async (id: any) => {
  try {
    const res = await axios.post(`feed/${id}/save`);

    return res;
  } catch (error: any) {
    console.log("error in createFeed api", error);
    // throw new Error(error);
    return false;
  }
};

export const deleteFeed = async (id: any) => {
  try {
    const res = await axios.delete(`feed/${id}`);

    return res;
  } catch (error: any) {
    console.log("error in createFeed api", error);
    // throw new Error(error);
    return false;
  }
};

export const commentList = async (data: any) => {
  let { limit, offset, feedId } = data;
  if (!limit) limit = 10;
  if (!offset) offset = 0;

  try {
    const res = await axios.get(
      `feed/${feedId}/comments?limit=${limit}&offset=${offset}`
    );

    return res;
  } catch (error: any) {
    console.log("error in feedList api", error);
    if (error.response.status == 404) {
      throw new Error("404");
    }
    throw new Error(error);
  }
};

export const addComment = async (data: any) => {
  try {
    const res = await axios.post(`feed/${data.feedId}/comment`, data);

    return res;
  } catch (error: any) {
    console.log("error in addComment api", error);
    throw new Error(error);
  }
};

export const commentLike = async (data: any) => {
  try {
    const res = await axios.post(
      `feed/${data.feedId}/comment/like?commentId=${data.commentId}`
    );

    return res;
  } catch (error: any) {
    console.log("error in commentLike api", error);
    throw new Error(error);
  }
};

export const commentDelete = async (data: any) => {
  try {
    const res = await axios.delete(
      `feed/${data.feedId}/comment?commentId=${data.commentId}`
    );

    return res;
  } catch (error: any) {
    console.log("error in commentDelete api", error);
    throw new Error(error);
  }
};

/* chats -------------- */

export const userList = async (data: any) => {
  let { limit = 10, offset = 0 } = data;
  let url = `users?limit=${limit}&offset=${offset}`;

  try {
    const res = await axios.get(url);

    return res;
  } catch (error: any) {
    console.log("error in user list api", error);
    if (error.response.status == 404) {
      throw new Error("404");
    }
    throw new Error(error);
  }
};

export const addChat = async (data: any) => {
  try {
    const res = await axios.post(`chat`, data);

    return res;
  } catch (error: any) {
    console.log("error in addComment api", error);
    throw new Error(error);
  }
};

export const messages = async (data: any) => {
  let { limit = 10, offset = 0, tab = "all" } = data;
  let url = `chat/messages?limit=${limit}&offset=${offset}&tab=${tab}`;

  try {
    const res = await axios.get(url);

    return res;
  } catch (error: any) {
    console.log("error in messages list api", error);
    if (error.response.status == 404) {
      throw new Error("404");
    }
    throw new Error(error);
  }
};
export const chats = async (id: any, data: any) => {
  let { limit = 10, offset = 0 } = data;
  let url = `chats/${id}?limit=${limit}&offset=${offset}`;

  try {
    const res = await axios.get(url);

    return res;
  } catch (error: any) {
    console.log("error in messages list api", error);
    if (error.response.status == 404) {
      throw new Error("404");
    }
    throw new Error(error);
  }
};

export const addGroup = async (data: any) => {
  try {
    const res = await axios.post(`group`, data);

    return res;
  } catch (error: any) {
    console.log("error in addGroup api", error);
    throw new Error(error);
  }
};

export const updateGroup = async (data: any) => {
  try {
    const res = await axios.put(`group`, data);

    return res;
  } catch (error: any) {
    console.log("error in updateGroup api", error);
    throw new Error(error);
  }
};

export const leaveGroup = async (connectionId: any) => {
  try {
    const res = await axios.put(`group/leave/${connectionId}`);

    return res;
  } catch (error: any) {
    console.log("error in leaveGroup api", error);
    throw new Error(error);
  }
};
export const deleteGroup = async (connectionId: any) => {
  try {
    const res = await axios.put(`group/delete/${connectionId}`);

    return res;
  } catch (error: any) {
    console.log("error in leaveGroup api", error);
    throw new Error(error);
  }
};

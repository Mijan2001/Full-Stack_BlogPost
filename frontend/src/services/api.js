const API_URL = 'https://blog-post-wasu.onrender.com/api';

// Helper function to get stored token
const getToken = () => {
    return localStorage.getItem('blogToken');
};

// Helper for headers with authentication
const authHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
    };
};

// Blog post API calls
export const fetchPosts = async () => {
    const response = await fetch(`${API_URL}/posts`);
    return response.json();
};

export const fetchPostById = async id => {
    const response = await fetch(`${API_URL}/posts/${id}`);
    return response.json();
};

// Separate auth header function without Content-Type
// export const createPost = async postData => {
//     const token = localStorage.getItem('token');

//     const response = await fetch(`${API_URL}/posts`, {
//         method: 'POST',
//         headers: {
//             Authorization: `Bearer ${token}`
//         },
//         body: postData
//     });

//     if (!response.ok) {
//         throw new Error('Failed to create post');
//     }

//     return response.json();
// };

export const createPost = async postData => {
    console.log('api.js createPost postData==', postData);

    const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(postData)
    });
    return response.json();
};

export const updatePost = async (id, postData) => {
    const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(postData)
    });
    return response.json();
};

export const deletePost = async id => {
    await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
    });
};

// Comment API calls
export const fetchCommentsByPostId = async postId => {
    const response = await fetch(`${API_URL}/comments/${postId}`);
    return response.json();
};

export const createComment = async commentData => {
    const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(commentData)
    });
    return response.json();
};

export const deleteComment = async id => {
    await fetch(`${API_URL}/comments/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
    });
};

// User API calls (admin functions)
export const fetchUsers = async () => {
    const response = await fetch(`${API_URL}/users`, {
        headers: authHeaders()
    });
    return response.json();
};

export const fetchUserById = async id => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'GET',
        headers: authHeaders()
    });

    const data = await response.json(); // wait for json to be parsed
    console.log('api.js fetchUserById data ===', data);
    return data;
};

export const updateUser = async (id, userData) => {
    console.log('api.js updateUser userData==', userData);
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(userData)
    });
    return response.json();
};

export const deleteUser = async id => {
    await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
    });
};

// Like/dislike API calls
export const likePost = async id => {
    const response = await fetch(`${API_URL}/posts/${id}/like`, {
        method: 'PUT',
        headers: authHeaders()
    });
    return response.json();
};

export const dislikePost = async id => {
    const response = await fetch(`${API_URL}/posts/${id}/dislike`, {
        method: 'PUT',
        headers: authHeaders()
    });
    return response.json();
};

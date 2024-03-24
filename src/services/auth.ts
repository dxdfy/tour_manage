import {post} from '../utils/request'

type LoginData={
    username:string;
    password:string;
}

/**
 * 
 * @param data 
 * @returns 
 */
export const loginAPI=(data:LoginData) =>post('/api/login',data);
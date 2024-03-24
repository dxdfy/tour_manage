import {get,post,patch,del} from '../utils/request'

export const loadDataAPI = (query:any ={}) => get('',query);

export const loadDataByNameAPI = (name:string) => get(''+name);

export const insertAPI =(data:any) =>post('',data);

export const updateByIdAPI =(id:string,data:any) => patch(''+id,data);

export const delByIdAPI =(id:string) =>del(''+id);
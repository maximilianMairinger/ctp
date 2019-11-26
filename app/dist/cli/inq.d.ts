declare type genericObject = {
    [key: string]: any;
};
export default function <T = any>(questions: ((ignore: string[]) => Promise<T>) | genericObject[], mergeTo?: genericObject): Promise<any>;
export {};

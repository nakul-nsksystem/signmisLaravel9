export interface IDbRow {
    id?:number ;
}

export class DbRowAbstract implements IDbRow { 
    public id?:number = undefined ;

    
    public created_m_user_id:number ; 
    public updated_m_user_id:number ; 

    constructor (createdMUserId:number) {
        this.created_m_user_id = createdMUserId ; 
        this.updated_m_user_id = createdMUserId ; 
    }

    public set CreatedMUserId(val:number){
        this.created_m_user_id = val ; 
        this.updated_m_user_id = val ; 
    }
}

class mypro{
    static PENDING='pending'
    static FUFILLED='fufilled'
    static REJECTED='rejected'
    constructor(executor){
        this.status=mypro.PENDING
        this.value=null
        this.callbacks=[]
        try {
            executor(this.resolve.bind(this),this.reject.bind(this))
        } catch (error) {
           this.reject(error) 
        }
    }
    resolve(value){
        if(this.status==mypro.PENDING){
            this.status=mypro.FUFILLED
            this.value=value
            setTimeout(()=>{
                this.callbacks.map(item=>{
                    item.onFulfilled(this.value)
                })
            })
            
        }
    }
    reject(reason){
        if(this.status==mypro.PENDING){
            this.status=mypro.REJECTED
            this.value=reason
            setTimeout(()=>{
                this.callbacks.map(item=>{
                    item.onRejected(this.value)
                })
            })
        }
    }
    then(onFulfilled,onRejected){
        if(typeof onFulfilled!='function'){
            onFulfilled=()=>this.value
        }
        if(typeof onRejected!='function'){
            onRejected=()=>this.value
        }
        let pro=new mypro((resolve,reject)=>{
            if(this.status==mypro.FUFILLED){
                setTimeout(()=>{
                    this.parse(pro,onFulfilled(this.value),resolve,reject)
                })
                
            }
            if(this.status==mypro.REJECTED){
                setTimeout(()=>{
                    this.parse(pro,onRejected(this.value),resolve,reject)
                })
            }
            if(this.status==mypro.PENDING){
                this.callbacks.push({
                    onFulfilled:value=>{
                        this.parse(pro,onFulfilled(value),resolve,reject)
                    },
                    onRejected:value=>{
                        this.parse(pro,onRejected(value),resolve,reject)
                    }
                })
            }
        })
        return pro
    }
    parse(promise,result,resolve,reject){
        if(promise==result)
            throw new TypeError('Chaining cycle detected')
        try {
            if(result instanceof mypro){
                result.then(resolve,reject)
            }
            else
                resolve(result)
        } catch (error) {
            reject(error)
        }
    }
    static resolve(value){
        return new mypro((resolve,reject)=>{
            if(value instanceof mypro){
                value.then(resolve,reject)
            }else
                resolve(value)
        })
    }
    static reject(value){
        return new mypro((resolve,reject)=>{
            
            reject(value)
        })
    }
    static all(promises){
        const values=[]
        return new mypro((resolve,reject)=>{
            promises.forEach(pro=>{
                pro.then(value=>{
                    values.push(value)
                    if(values.length==promises.length){
                        resolve(values)
                    }
                },reason=>{
                    reject(reason)
                })
            })
        })
    }
    static race(promises){
        return new mypro((resolve,reject)=>{
            promises.map(pro=>{
                pro.then(value=>{
                    resolve(value)
                },reason=>{
                    reject(reason)
                })
            })
        })
    }
}
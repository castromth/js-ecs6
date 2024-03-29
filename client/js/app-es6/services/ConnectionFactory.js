const stores = ["negociacoes"];
const version = 1;
const dbName = "aluraframe";

var connection = null;
var close;

export class ConnectionFactory {

    constructor(){
        throw new Error("Nao e possivel criar instancias de ConnectionFactory!!")
    }
    static getConnection(){
        return new Promise((resolve,reject)=>{
            let openRequest = window.indexedDB.open(dbName,version);
            openRequest.onupgradeneeded = e => {
                ConnectionFactory._creatStores(e.target.result);
            };

            openRequest.onsuccess = e =>{
                if(!connection){
                    connection = e.target.result;
                    close = connection.close.bind(connection);
                    connection.close = function(){
                        throw new Error("Voce nao pode fechar diretamente a coneccao");
                    };
                }
                resolve(connection);
            };

            openRequest.onerror = e => {
                console.log(e.target.error);
                reject(e.target.error.name);
            };
        });
    }
    static _creatStores(connection){
        stores.forEach(store =>{
            if(connection.objectStoreNames.contains(store))
                connection.deleteObjectStore(store);
            connection.createObjectStore(store,{autoIncrement: true});
        });
    }

    static closeConnection(){
        if(connection){
            close();
            connection = null;
        }
    }
}

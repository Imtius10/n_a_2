import app from "./app";

const main = async () => {
    app.listen(6000, () => {
       console.log("running at 6000");
       
   }) 
}


main()
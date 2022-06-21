

exports.getDate= function()
{
    let today = new Date();
    let option ={
        weeday :"long",
        day :"numeric",
        month: "long"
    };
    let day = today.toLocaleDateString("en-Us",option);
    return day;
}

exports.getDay= function()
{
    let today = new Date();
    let option ={
       
        weekday :"long",
       
    };
    let day = today.toLocaleDateString("en-Us",option);
    return day;
}

console.log(exports);
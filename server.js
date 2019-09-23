var express = require('express');
var path = require('path');

const app = express();
const util = require('util');
const exec = util.promisify(require('child_process').exec);


const url = "jspijkervet.com"

async function rebuild_site() {
    const { stdout, stderr } = await exec('gatsby build');
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/build', function(req, res) {
    console.log(req.headers.host, url);
    if (req.headers.host == url) {
        console.log('rebuilding site')
        rebuild_site();
    }
    res.redirect(200, '/')
});


app.use('/', function(req,res){
    res.render('./public/index')
});

app.listen(9000, function(){
    console.log("Running on port 9000")
});

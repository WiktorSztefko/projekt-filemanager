let express = require("express")
let app = express()
var PORT = process.env.PORT || 3000;
let path = require("path")

app.use(express.static('static'))

let hbs = require('express-handlebars');
let formidable = require('formidable');

app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');                           // określenie nazwy silnika szablonów



let tabImages = []
let id = 0


app.engine('hbs', hbs({
    extname: '.hbs',
    partialsDir: "views/partials",
}));


let ShowThisFile

app.get("/", function (req, res) {
    ShowThisFile = "" //czyścimy zawartość 
    res.render('upload.hbs');
});

app.get("/upload", function (req, res) {
    ShowThisFile = "" //czyścimy zawartość 
    res.render('upload.hbs');
});

app.get("/filemanager", function (req, res) {
    ShowThisFile = "" //czyścimy zawartość 
    res.render('filemanager.hbs', { tabImages });   // nie podajemy ścieżki tylko nazwę pliku
})

app.get("/info/:id", function (req, res) {

    let info = req.params.id //pobranie parametru z adresu
    for (i = 0; i < tabImages.length; i++) {
        if (info == tabImages[i].id) {
            ShowThisFile = tabImages[i]
        }
    }
    res.redirect("/info") //przekierowanie

})

app.get("/info/", function (req, res) {
    //console.log(ShowThisFile)
    res.render("info.hbs", { ShowThisFile })
})

app.post('/filemanager', function (req, res) {

    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/static/upload/'       // folder do zapisu zdjęcia
    form.keepExtensions = true                           // zapis z rozszerzeniem pliku
    form.multiples = true                                // zapis wielu plików                          
    form.parse(req, function (err, fields, files) {

        if (Array.isArray(files.imageFromUpload)) {
            //console.log("to tablica")
            for (i = 0; i < files.imageFromUpload.length; i++) {
                let image = files.imageFromUpload[i]
                if (image && image.name) {

                    let name = files.imageFromUpload[i].name
                    let location = files.imageFromUpload[i].path
                    let size = files.imageFromUpload[i].size
                    let type = files.imageFromUpload[i].type
                    let saveDate = new Date()
                    saveDate = createDate(saveDate)
                    let extension = name.split(".")[1]
                    extension = extension.toLowerCase() //zamiana na małe literki
                    let nameOnUpload = path.basename(location) //wyodrębnij nazwę pliku ze ścieżki pliku

                    id++
                    //console.log(extension)
                    if (extension != "docx" && extension != "xlsx" && extension != "pptx" && extension != "mp3" && extension != "jpg" && extension != "png" && extension != "html" && extension != "css" && extension != "js" && extension != "txt" && extension != "pdf") {
                        extension = "unknown" //extension potrzebne do odpowiedniej ikonki
                    }

                    let object = {
                        id: id,
                        name: name,
                        path: location,
                        size: size,
                        type: type,
                        saveDate: saveDate,
                        extension: extension,
                        nameOnUpload: nameOnUpload
                    }

                    tabImages.push(object)
                }
            }
        }
        else {
            //console.log("to nie tablica")
            let image = files.imageFromUpload
            if (image && image.name) {
                let name = files.imageFromUpload.name
                let location = files.imageFromUpload.path
                let size = files.imageFromUpload.size
                let type = files.imageFromUpload.type
                let saveDate = new Date()
                saveDate = createDate(saveDate)
                let extension = name.split(".")[1]
                extension = extension.toLowerCase()
                let nameOnUpload = path.basename(location) //wyodrębnij nazwę pliku ze ścieżki pliku
                //console.log(extension)
                id++

                if (extension != "docx" && extension != "xlsx" && extension != "pptx" && extension != "mp3" && extension != "jpg" && extension != "png" && extension != "html" && extension != "css" && extension != "js" && extension != "txt" && extension != "pdf") {
                    extension = "unknown"
                }

                let object = {
                    id: id,
                    name: name,
                    path: location,
                    size: size,
                    type: type,
                    saveDate: saveDate,
                    extension: extension,
                    nameOnUpload: nameOnUpload
                }

                tabImages.push(object)
            }
        }

        //console.log(files.imageFromUpload)
        res.render("filemanager.hbs", { tabImages }) //wysyłamy tablice obiektów
    });
});

function createDate(time) { //funkcja do tworzenia stringa czasu

    let sekundy = time.getSeconds()
    sekundy = zero(sekundy)

    let minuty = time.getMinutes()
    minuty = zero(minuty)

    let godziny = time.getHours()
    godziny = zero(godziny)

    let days = time.getDate()
    days = zero(days)

    let month = time.getMonth()
    month++
    month = zero(month)

    let year = time.getFullYear()
    year = zero(year)

    function zero(wartosc) { // 1 -> 01

        if (wartosc < 10) {
            wartosc = "0" + wartosc
        }
        return wartosc
    }
    time = `${days}.${month}.${year} ${godziny}:${minuty}:${sekundy}` //czas string
    return time
}

app.get("/removeAll", function (req, res) {
    tabImages = [] //wyczyszczenie całej tablicy z obiektami
    res.redirect("/filemanager")

})

app.get("/delete/:id", function (req, res) { //parametr

    let identyfikator = req.params.id //pobranie parametru z adresu
    for (i = 0; i < tabImages.length; i++) {
        if (identyfikator == tabImages[i].id) {
            tabImages.splice(i, 1) //usunięcie wybranego indeksu
        }
    }
    res.redirect("/filemanager") //przekierowanie


})

//nasłuch na określonym porcie
app.listen(PORT, function () {
    console.log("to jest start serwera na porcie " + PORT)
})
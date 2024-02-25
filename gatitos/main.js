

const API_URL_RANDOM =     'https://api.thecatapi.com/v1/images/search?limit=2';
const API_URL_FAVOURITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_FAVOURITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';


const spanError = document.getElementById('error')

async function loadRandomCats() { 
    
        const response = await fetch(API_URL_RANDOM); //llamamos api
        const data = await response.json(); // convertimos a sintaxis que js entienda con el response.json
        console.log('Random')
        console.log(data) // llamamos 3 elementos en html
        
        
        if (response.status !== 200) {
          spanError.innerHTML = "there was an error: " + response.status;

        } else {
        
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');
        
        img1.src = data[0].url // les cambiamos el atributo src para dinamicamente ponerles la url que nos pone la api
        img2.src = data[1].url

        btn1.onclick = () => saveFavouriteCats(data[0].id);
        btn2.onclick = () => saveFavouriteCats(data[1].id);
        }
        
}

async function loadFavouriteCats() { 
    
  const response = await fetch(API_URL_FAVOURITES, {
    method: 'GET',
    headers: {
      'X-API-KEY': 'live_F9dwdXjlesGEBkTa9KEHtvUhigP3yB8978bhLw8pqSalK5Y4mqcaKK4jSv7zt2Jf', //AUTHORIZATION HEADER

    },
  }); //llamamos api
  const data = await response.json(); // convertimos a sintaxis que js entienda con el response.json
  console.log('favourites')
  console.log(data) 

  if (response.status !== 200 ){
      spanError.innerHTML = "hubo error: " + response.status + data.message;
  } else {
    const section = document.getElementById('favourites')
    section.innerHTML = "";

    const h2 = document.createElement('h2');
    const h2Text = document.createTextNode('Your favourites');
    h2.appendChild(h2Text);
    section.appendChild(h2);

    data.forEach(cat => {
     const article = document.createElement('article');
     const img = document.createElement('img');
     const btn = document.createElement('button');
     const btnText = document.createTextNode('Unsave cat');


     img.src = cat.image.url;
     img.width = 150;
     btn.appendChild(btnText);
     btn.onclick = () => deleteFavouriteCats(cat.id);
     article.appendChild(img);
     article.appendChild(btn);
     section.appendChild(article);
      
    });
  }
  
}

async function saveFavouriteCats(id) {
  const response = await fetch(API_URL_FAVOURITES, { // cuando llamamos a fetch y queremos especificar un metodo distinto al default(get), hay que especificarlo con un argumento o en este caso objeto
    method: 'POST', //necesitamos post por indicaciones de ala api cats
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY' : 'live_F9dwdXjlesGEBkTa9KEHtvUhigP3yB8978bhLw8pqSalK5Y4mqcaKK4jSv7zt2Jf',
    },
    body: JSON.stringify({
      image_id: id

    }),
  });
  const data = await response.json();

  console.log('Save')
  console.log(response)

  if (response.status != 200 ){
    spanError.innerHTML = "hubo error: " + response.status + data.message;
  } 
  else{
    console.log('Cat saved in favourites')
    loadFavouriteCats();
  }
  
}



async function deleteFavouriteCats(id) {
  const response = await fetch(API_URL_FAVOURITES_DELETE(id), { // cuando llamamos a fetch y queremos especificar un metodo distinto al default(get), hay que especificarlo con un argumento o en este caso objeto
    method: 'DELETE', //necesitamos post por indicaciones de ala api cats
    headers: {
      'X-API-KEY' : 'live_F9dwdXjlesGEBkTa9KEHtvUhigP3yB8978bhLw8pqSalK5Y4mqcaKK4jSv7zt2Jf',
    }
  });
  const data = await response.text();

  if (response.status != 200 ){
    spanError.innerHTML = "hubo error: " + response.status + data.message;
  }
  else{
    console.log('Cat unsaved')
    loadFavouriteCats();

  }

}

async function uploadCatPhoto() {
  const form = document.getElementById('uploadingForm')
  const formData =  new FormData(form);

  console.log(formData.get('file'))

  const response = await fetch(API_URL_UPLOAD, {
    method: 'POST',
    headers: {
      //'Content-Type': 'multipart/form-data', // noes necesario porque ya pusimos formData
      'X-API-KEY' : 'live_F9dwdXjlesGEBkTa9KEHtvUhigP3yB8978bhLw8pqSalK5Y4mqcaKK4jSv7zt2Jf',
    },
    body: formData, // fetch es tna inteligente que si le enviamos una instancia del prototipo form data, automaticamente va a poner el content type y agregar el boundary
  })
  const data = await response.json();


  if (response.status !== 201) {
    spanError.innerHTML = "Hubo un error: " + response.status + data.message;
    console.log({data})

  }else {
    console.log('Picture saved correctly :)')
    console.log({data})
    console.log(data.url)
    saveFavouriteCats(data.id);

  }
}
 
async function functionminiatura() {
  const form = document.getElementById('uploadingForm')
  const formData = new FormData(form)
//usamos el FileReader para sacar la información del archivo del formData
  const reader = new FileReader();

//Este código es para borrar la miniatura anterior al actualizar el form.
  if (form.children.length === 3) {
      const preview = document.getElementById("preview")
      form.removeChild(preview)
  }
//aquí sucede la magia, el reader lee los datos del form.
  reader.readAsDataURL(formData.get('file'))

//Éste código es para cuando termine de leer la info de la form, cree una imagen miniatura de lo que leyó el form.
  reader.onload = () => {
      const previewImage = document.createElement('img')
      previewImage.id = "preview"
      previewImage.width = 50
      previewImage.src = reader.result
      form.appendChild(previewImage);
  }

}

loadRandomCats();
loadFavouriteCats();


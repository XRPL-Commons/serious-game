// makes sure the secret is set when a route needs it
// le middleware tourne à chaque requete au back

export default defineEventHandler(async (event) => {
  const secret = event.headers.get('x-secret') //si pas token alors envoyer header de JSONcontent x-email et x-password pour prouver qu'on est admin
  if (secret === 'community') {
    event.context.secretIsKnown = true
    //event.context.role= 'teacher'

        //event.context.password= 'GetCollection(password) ??
      }
})

// à utiliser afin de vérifier si l'user peut accéder à l'url /teacher/classroom

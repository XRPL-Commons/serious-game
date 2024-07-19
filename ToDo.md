Chose qu'il reste à faire :

- [name].vue, refresh la page dès qu'on a update les accounts
- Dans l'interface de teacher, il doit être possible de générer une paire de clé pour un seul étudiant en l'ayant sélectionné, on a déjà commencé à le faire (voir page/teacher/[name]/[name].vue)
- Crée une colonne rank dans l'interface teacher qui attribue à chaque élève son rank en fonction de la colonne oldest transaction.
- Lorsque qu'un teacher ajoute un éleve on doit envoyer un mail à l'étudiant contenant son mail/nom sur la plateforme / mot de passe provisoire.
- Crée un système de sign up pour que le teacher montre simplement un QR code à sa classe et chacun arrive sur une page pour sign up. Ou faire quelque chose de similaire à Kahoot avec un code permettant d'accéder à la partie.
- Automatiser le système de génération de scénario pour le serious-game. En utilisant une clé Open AI qui génère le scénario et qui est ensuite disponible sur l'interface de l'élève.
- Améliorer l'interface graphique.
- Rajouter un champ classrooms dans la table User qui contient un tableau avec toutes les classes dans lesquelles l'étudiant est inscrit. Ceci permet d'optimiser la fonction ListUsersStudent dans mongo.ts qui itère sur toutes les classroom.
- Si un teacher souhaite ajouter dans sa classe un student notre fonction l'ajoute à la fois dans la BD users et dans la classroom en question. Sauf que si le student est déjà dans une classroom il est par conséquent déjà dans la BD user. Donc en voulant l'ajouter, le teacher rencontrera une erreur car il ne peux y avoir de duplica dans la BD user.
- Mesure de sécurité interdisant l'accès à des routes telles que /admin ou /teacher , en fonction du rôle de l'utilisateur.

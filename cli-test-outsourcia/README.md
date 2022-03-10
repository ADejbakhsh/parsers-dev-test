# Commentaire a propos du teste et du code
Le teste demande que tout le code soit écris dans le main.js, ceux qui rend la lecture lourde.
Donc tout est dans le même fichier que ce soit les utiles aux core function.

Je recommande de lire le code de bas en haut.

J'ai pris plus que 5h pour faire ce code, j'ai notamment prit pas mal de temps à juste réfléchir à comment aborder le problème.
Que ce soit la recréation de la Class Domparser à créé un générateur de scrapeur.
Les regex étant fortement déconseillé sur internet, je ne comprenais pas pourquoi il fallait impérativement les utiliser.
Finalement, ce n'était pas si mal, mais j'exprime des doutes sur la capacité de code à être valide dans le temps.
Singulièrement à cause du fait que j'utilise la position dans des array ce qui me semble être une très mauvaise idée.
Des regex plus précise aurait lieu aussi à leurs lots de difficultés, je n'ai pas trouvé de solution parfaite.

En tout cas j'aimerais vraiment parlez avec vous à propos des parseurs même si vous ne me prenez pas, car la problématique est très intéressante techniquement.



# Parser Creation Test

This test's goal is to evaluate your capacity at creating parsers. Parsers are samples of code that are designed to extract information from various sources. In that case you will have to extract information from an email's HTML that have been anonymised.

# How to do the test?

Run `yarn install` or `npm install`.

You are expected to write your code `main.js` in the root folder. Expected results are located in the `expectedResults.js` file.

You must use Vanilla JS and regex to extract information from samples. You have NOT access to the DOM (don’t use window.getElementFromId for example)

To check your results when you're done run `yarn test` or `npm run test` depending on what tool you use.

All the test must pass in order for the test to be considered complete. We expect something that is legible and comprehensible by a regular software developper.

Good luck !

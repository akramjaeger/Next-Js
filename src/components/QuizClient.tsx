"use client";
import { useState } from "react";

type Question = { q: string; o: string[]; a: number; e: string };

const questions: Question[] = [
{q:"Dans une application 100 % CSR, que reçoit généralement le navigateur au départ ?",o:["Une page HTML complète avec tout le contenu","Un HTML initial minimal accompagné du JavaScript à exécuter","Uniquement une image de la page","Une réponse SQL directe"],a:1,e:"En CSR, le navigateur reçoit généralement un HTML initial minimal puis le JavaScript construit l’interface."},
{q:"Quelle stratégie Next.js permet de générer une page HTML à l’avance, avant la requête de l’utilisateur ?",o:["SSG","CSR uniquement","WebSocket","LocalStorage"],a:0,e:"SSG (Static Site Generation) produit des pages statiques à l’avance."},
{q:"Quel est le principal effet du SSR sur l’affichage initial ?",o:["Le contenu peut être présent dans le HTML envoyé au navigateur","Il supprime tout JavaScript","Il transforme automatiquement toutes les pages en images","Il interdit l’interactivité"],a:0,e:"Avec le SSR, le serveur génère du HTML contenant le contenu de la page avant son arrivée dans le navigateur."},
{q:"Pourquoi le pré-rendu peut-il améliorer le SEO ?",o:["Les moteurs reçoivent directement du contenu HTML exploitable","Il augmente automatiquement le nombre de backlinks","Il désactive les robots des moteurs","Il remplace les balises HTML par du SQL"],a:0,e:"Le contenu pré-rendu est disponible dans le HTML initial, ce qui facilite son exploration et son indexation."},
{q:"Dans l’App Router de Next.js, quel type de composant est utilisé par défaut ?",o:["Client Component","Server Component","Web Component","Service Worker"],a:1,e:"Dans l’App Router, les composants sont des Server Components par défaut, sauf lorsqu’un composant doit être client."},
{q:"Quel mot-clé/directive indique qu’un composant doit être exécuté côté client ?",o:["use server","use client","client only","render client"],a:1,e:"La directive 'use client' marque la frontière d’un Client Component."},
{q:"Quel bénéfice les Server Components peuvent-ils apporter ?",o:["Réduire la quantité de JavaScript nécessaire côté navigateur","Forcer chaque page à être dynamique","Empêcher toute récupération de données","Supprimer le HTML"],a:0,e:"Les Server Components permettent de garder certaines parties de la logique côté serveur et de limiter le JavaScript envoyé au client."},
{q:"Quelle fonctionnalité Next.js permet de charger un composant JavaScript seulement lorsque cela est nécessaire ?",o:["Dynamic Imports","Static HTML","Open Graph","Middleware CSS"],a:0,e:"Les Dynamic Imports permettent de charger certaines parties du code à la demande."},
{q:"Quel est l’objectif principal du code splitting ?",o:["Diviser le JavaScript en morceaux plus petits","Fusionner toutes les images en une seule","Supprimer les styles CSS","Créer une base de données"],a:0,e:"Le code splitting répartit le code en plusieurs bundles ou chunks afin d’éviter de télécharger tout le JavaScript inutilement."},
{q:"Quel mécanisme permet d’afficher progressivement certaines parties d’une interface ?",o:["Streaming","Minification SQL","Cookies","Sprite CSS"],a:0,e:"Le streaming permet d’envoyer progressivement des morceaux de l’interface au navigateur."},
{q:"Quel problème le streaming cherche-t-il notamment à réduire ?",o:["L’attente avant que toute la page soit disponible","Le nombre de domaines Internet","La taille des bases SQL","Le nombre de couleurs CSS"],a:0,e:"Le streaming permet d’afficher des parties prêtes sans attendre que toute la page soit entièrement générée."},
{q:"Que peut fournir l’API Metadata de Next.js ?",o:["Des métadonnées comme le titre, la description et les informations Open Graph","Des pilotes matériels","Des comptes utilisateurs automatiquement","Des tables SQL"],a:0,e:"L’API Metadata permet de définir des métadonnées de page, notamment utiles pour le SEO et le partage social."},
{q:"Quelle métadonnée est particulièrement liée à l’image affichée lors d’un partage social ?",o:["og:image","db:image","js:image","css:image"],a:0,e:"og:image est une propriété Open Graph couramment utilisée pour définir l’image d’aperçu."},
{q:"Pourquoi les métadonnées Open Graph sont-elles importantes pour le partage social ?",o:["Elles permettent aux plateformes de construire un aperçu du lien","Elles accélèrent le processeur de l’utilisateur","Elles remplacent le protocole HTTP","Elles rendent les images interactives"],a:0,e:"Les plateformes sociales peuvent utiliser les métadonnées Open Graph pour afficher un titre, une description et une image d’aperçu."},
{q:"Quel problème de CSR 100 % client Next.js peut-il aider à éviter grâce au pré-rendu ?",o:["Une page initialement vide en attendant l’exécution complète du JavaScript","La présence d’un clavier physique","La création de fichiers PDF locaux","La résolution DNS"],a:0,e:"Le pré-rendu fournit du HTML avec du contenu avant que toute l’interactivité JavaScript ne soit disponible."},
{q:"Quelle affirmation décrit le mieux l’approche hybride de Next.js ?",o:["Tout est exécuté exclusivement sur le navigateur","Tout est exécuté exclusivement sur le serveur","Le serveur et le client sont utilisés selon les besoins de l’application","Aucun JavaScript n’est jamais utilisé"],a:2,e:"Next.js permet de combiner rendu serveur, génération statique et composants client selon les besoins."},
{q:"Quel choix est particulièrement adapté à une interface nécessitant des clics, états locaux ou API navigateur ?",o:["Client Component","Server Component uniquement","Fichier SQL","Image statique"],a:0,e:"Les interactions nécessitant des fonctionnalités du navigateur ou un état client sont adaptées aux Client Components."},
{q:"Quelle solution contribue directement à réduire le JavaScript initial envoyé au navigateur ?",o:["Utiliser des Server Components lorsque l’interactivité côté client n’est pas nécessaire","Mettre tout le code dans un seul Client Component","Ajouter davantage de bibliothèques côté client","Désactiver le HTML"],a:0,e:"Les Server Components permettent de conserver certaines parties de l’application hors du bundle JavaScript client."},
{q:"Pour une page de contenu qui change rarement, quelle stratégie est souvent pertinente ?",o:["SSG","CSR obligatoire","WebSocket permanent","Client Component pour toute la page"],a:0,e:"Une page qui change rarement peut être générée statiquement puis servie rapidement."},
{q:"Pour des données personnalisées qui dépendent de la requête de l’utilisateur, quelle approche peut être appropriée ?",o:["Rendu dynamique côté serveur","Toujours une image statique","Toujours SSG sans revalidation","Suppression des données"],a:0,e:"Le rendu dynamique côté serveur peut être utilisé lorsque le contenu dépend de la requête ou du contexte de l’utilisateur."},
{q:"Que signifie CSR ?",o:["Client-Side Rendering","Central Server Routing","Client Static Repository","Cloud Service Rendering"],a:0,e:"CSR signifie Client-Side Rendering : le rendu de l’interface est principalement effectué côté navigateur."},
{q:"Que signifie SSR ?",o:["Server-Side Rendering","Static Script Routing","Server Storage Rendering","Simple Site Reload"],a:0,e:"SSR signifie Server-Side Rendering : le serveur génère le HTML de la réponse."},
{q:"Que signifie SSG ?",o:["Static Site Generation","Server Script Gateway","Simple Server Graph","Static Style Generator"],a:0,e:"SSG signifie Static Site Generation : les pages statiques sont générées à l’avance."},
{q:"Vrai ou faux : avec SSR, le navigateur n’a plus besoin de JavaScript pour rendre une page interactive.",o:["Vrai","Faux"],a:1,e:"Le SSR peut fournir le HTML initial, mais JavaScript reste nécessaire pour de nombreuses interactions côté client."},
{q:"Vrai ou faux : Next.js permet d’utiliser des Server Components et des Client Components dans une même application.",o:["Vrai","Faux"],a:0,e:"L’approche hybride de Next.js permet de combiner des composants serveur et client."},
{q:"Vrai ou faux : les Dynamic Imports obligent l’utilisateur à télécharger tout le JavaScript de l’application avant toute utilisation.",o:["Vrai","Faux"],a:1,e:"Les imports dynamiques permettent justement de charger certaines parties du code uniquement lorsque nécessaire."},
{q:"Vrai ou faux : les métadonnées Open Graph peuvent contribuer à améliorer l’aperçu d’un lien partagé sur les réseaux sociaux.",o:["Vrai","Faux"],a:0,e:"Les propriétés Open Graph servent notamment à décrire le contenu présenté dans les aperçus de liens."},
{q:"Vrai ou faux : le streaming signifie nécessairement que toute la page doit être envoyée en une seule fois.",o:["Vrai","Faux"],a:1,e:"Le streaming permet au contraire d’envoyer progressivement des parties de la réponse lorsqu’elles sont prêtes."},
{q:"Vrai ou faux : une application Next.js doit obligatoirement être rendue 100 % côté serveur.",o:["Vrai","Faux"],a:1,e:"Next.js prend en charge une combinaison de stratégies serveur, statiques et client."},
{q:"Quel ensemble correspond le mieux aux solutions Next.js face aux limites du CSR 100 % client ?",o:["SSR/SSG, Server Components, Metadata, Dynamic Imports et Streaming","SQL, FTP, SMTP et DNS uniquement","CSS, images et cookies uniquement","WebSockets uniquement"],a:0,e:"Cet ensemble regroupe les principales techniques Next.js permettant d’améliorer affichage initial, SEO, partage social et chargement."},
];

export default function QuizClient() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [corrected, setCorrected] = useState(false);

  const score = questions.filter((q, i) => answers[i] === q.a).length;
  const pct = Math.round((score / questions.length) * 100);

  function reset() {
    setAnswers({});
    setCorrected(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      {questions.map((x, i) => {
        const selected = answers[i];
        const show = corrected;
        return (
          <section key={i} className="rounded border p-4 my-4">
            <p className="font-bold">
              {i + 1}. {x.q}
            </p>
            <div className="mt-2 space-y-2">
              {x.o.map((opt, j) => (
                <label key={j} className="block rounded border p-2">
                  <input
                    type="radio"
                    name={`q${i}`}
                    checked={selected === j}
                    onChange={() => setAnswers((a) => ({ ...a, [i]: j }))}
                    className="mr-2"
                  />
                  {String.fromCharCode(65 + j)}. {opt}
                </label>
              ))}
            </div>
            {show && (
              <div
                className={
                  selected === undefined
                    ? "mt-2 rounded border-l-4 border-yellow-500 bg-yellow-50 p-2"
                    : selected === x.a
                      ? "mt-2 rounded border-l-4 border-green-600 bg-green-50 p-2"
                      : "mt-2 rounded border-l-4 border-red-600 bg-red-50 p-2"
                }
              >
                {selected === undefined ? (
                  <p>
                    <strong>Non répondu.</strong> Réponse attendue : {x.o[x.a]}.
                  </p>
                ) : (
                  <p>
                    {selected === x.a ? "Bonne réponse. " : "Réponse incorrecte. "}
                    {x.e}
                  </p>
                )}
              </div>
            )}
          </section>
        );
      })}

      {corrected && (
        <div className="rounded border-2 border-blue-200 p-4 my-4">
          <h2 className="font-bold">Résultat</h2>
          <p className="text-2xl font-extrabold text-blue-700">
            {score} / {questions.length} — {pct} %
          </p>
          <p>
            {pct >= 80
              ? "Très bonne maîtrise des solutions apportées par Next.js aux limites du CSR."
              : pct >= 60
                ? "Bonne base. Revoyez surtout les différences entre CSR, SSR, SSG et les Server Components."
                : "Revoyez les notions clés : pré-rendu, Server Components, Metadata, Dynamic Imports et Streaming."}
          </p>
        </div>
      )}

      <div className="flex gap-3 py-4">
        <button
          onClick={() => {
            setCorrected(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="rounded bg-blue-600 px-4 py-2 font-bold text-white"
        >
          Corriger le quiz
        </button>
        <button
          onClick={reset}
          className="rounded bg-gray-200 px-4 py-2 font-bold"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}

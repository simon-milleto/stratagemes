import { styled } from "styled-system/jsx";
import { TextHeading } from "./TextHeading";


const RulesHeading = styled(TextHeading, {
    base: {
        fontSize: '2xl',
        fontWeight: 'bold',
        color: 'dark',
        marginBottom: '1rem',
        marginTop: '1rem'
    }
});

export default function RulesDescription() {
    return (
        <>
            <RulesHeading hasShadow={false}>
                Aperçu et but du jeu
            </RulesHeading>
            <p>
                Stratagèmes est un jeu de placement de pions sur plateau où vous devez :
            </p>
            <ul>
                <li>aligner côte-à-côte (horizontalement, verticalement ou en diagonale)
                    <b>4 pierres de votre couleur secrète</b>
                </li>
                <li><b>OU</b></li>
                <li>capturer 5 pions de couleur identique</li>
            </ul>
            <p>
                Chaque joueur se voit attribuer en début de partie une carte “couleur secrète” avec laquelle
                il devra réussir son alignement. Cependant, vous ne maîtrisez pas la couleur des gemmes
                de votre main. Vous devrez adapter au mieux vos actions en fonction de votre main, de
                l’évolution du plateau de jeu et de vos adversaires.
            </p>

            <RulesHeading hasShadow={false}>
                Déroulement d'une partie
            </RulesHeading>
            <ul>
                <li>Chaque joueur est obligé de poser une gemme sur le plateau lors de son tour.</li>
                <li>Le premier joueur doit poser sa première pierre au centre du plateau, indiqué par la case au
                    symbole doré.</li>
                <li>Il n’est possible d’ajouter une gemme sur le plateau que dans une des cases adjacentes à une
                    autre gemme déjà présente.</li>
                <li>Encercler une gemme à ses deux extrémités par deux gemmes d’une même autre couleur la
                    capture. La gemme capturée doit être posée sur la carte initiative du joueur l’ayant capturé, de
                    manière visible.</li>
                <li>Il est possible de faire des captures multiples avec une seule pose de gemme. Il faut cependant
                    respecter la règle d’un encerclement d’une pierre par deux autres.</li>
            </ul>

            <RulesHeading hasShadow={false}>
                Tour de jeu
            </RulesHeading>

            <ul>
                <li>Chaque joueur doit commencer son tour avec autant de gemmes derrière son cache-pion que
                de nombre de joueurs dans la partie (à l’exception des parties à 2 joueurs, où vous devez avoir
                3 gemmes).</li>
                <li>Le joueur place sur le plateau la gemme de son choix parmi celles en sa possession, en
                respectant les règles générales.</li>
                <li>Il choisit ensuite les gemmes restantes dans sa main, celles qu’il souhaite remettre dans le sac
                de tirage.</li>
                <li>Le joueur termine son tour en piochant dans le sac de tirage jusqu’à avoir le même nombre de
                gemmes qu’en début de partie.</li>
            </ul>

            <RulesHeading hasShadow={false}>
                Fin du jeu
            </RulesHeading>

            <p>
                La partie prend fin dès qu’un joueur remplit une des deux conditions de victoire :
                Avoir aligné sur le plateau côte à côte horizontalement, verticalement ou
                diagonalement 4 gemmes de sa couleur secrète (même si ce n’est pas lui qui a posé la
                dernière pierre pour le faire).
                Avoir capturé au moins 5 gemmes d’une même couleur. Il est possible de gagner en
                capturant 5 pierres de sa couleur secrète, mais ce n’est pas obligatoire.
            </p>
        </>
    );
}

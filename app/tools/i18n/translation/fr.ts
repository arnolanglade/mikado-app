import { Translations } from '@/tools/i18n/translation';

const translationFr: Translations = {
  test: 'test fr',
  add: 'Ajouter',
  cancel: 'Annuler',
  loading: 'Chargement...',
  'documentation-link': '📕 Apprenez à utiliser la MikadoApp',
  'mikado-graph.start': 'Démarrer',
  'mikado-graph.done': 'Super ! Vous avez terminé votre tâche !',
  'mikado-graph.error.emptyGoal': 'L\'objectif ne peut pas être vide',
  'mikado-graph.goal-and-objective': 'Quel est votre objectif ?',
  'mikado-graph.your-goal': '<strong>Votre objectif</strong> : {goal}',
  'mikado-graph.placeholder': 'Expliquez votre objectif. Par exemple : "Je veux mettre à jour la version du framework"',
  'mikado-graph.notification.success.start': 'Vous êtes prêt à commencer à travailler sur votre tâche',
  'prerequisite.label': '<strong>Prérequis</strong> : {label}',
  'prerequisite.placeholder': 'Expliquez ce que vous devez faire. Par exemple : "Je dois renommer cette méthode"',
  'prerequisite.add': 'Ajouter un prérequis',
  'prerequisite.notification.add-prerequisite.success': 'Le prérequis a été ajouté',
  'prerequisite.notification.start-experimentation.success': 'Vous commencez à expérimenter un prérequis, bonne chance !',
  'prerequisite.start-experimentation': 'Démarrer l\'exploration',
  'prerequisite.commit-changes': 'Valider les changements',
  'prerequisite.notification.success.commit-changes': 'Super, vous avez validé vos changements. L\'expérimentation est terminée !',
  'prerequisite.done': 'Super ! Vous avez terminé le prérequis !',
  'prerequisite.error.emptyLabel': 'Veuillez fournir un libellé',
  'notification.error': 'Oups, quelque chose s\'est mal passé. Veuillez réessayer.',
};

export default translationFr;

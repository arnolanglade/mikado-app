import { Translations } from '@/tools/i18n/translation';

const translationFr: Translations = {
  test: 'test fr',
  add: 'Ajouter',
  cancel: 'Annuler',
  loading: 'Chargement...',
  'mikado-graph.start': 'Démarrer une tâche',
  'mikado-graph.done': 'Super ! Vous avez terminé votre tâche !',
  'mikado-graph.error.emptyGoal': 'L\'objectif ne peut pas être vide',
  'mikado-graph.goal-and-objective': 'Quel est votre objectif ou votre objectif ?',
  'mikado-graph.your-goal': '<strong>Votre objectif</strong> : {goal}',
  'mikado-graph.notification.success.start': 'Vous êtes prêt à commencer à travailler sur votre tâche',
  'prerequisite.label': '<strong>Prérequis</strong> : {label}',
  'prerequisite.add': 'Ajouter un prérequis',
  'prerequisite.notification.add-prerequisite.success': 'Le prérequis a été ajouté',
  'prerequisite.notification.start-experimentation.success': 'Vous commencez à expérimenter un prérequis, bonne chance !',
  'notification.error': 'Oups, quelque chose s\'est mal passé. Veuillez réessayer.',
  'prerequisite.start-experimentation': 'Démarrer l\'expérimentation',
  'prerequisite.commit-changes': 'Valider les changements',
  'prerequisite.notification.success.commit-changes': 'Super, vous avez validé vos changements. L\'expérimentation est terminée !',
  'prerequisite.done': 'Super ! Vous avez terminé le prérequis !',
  'prerequisite.error.emptyLabel': 'Veuillez fournir un libellé',
};

export default translationFr;

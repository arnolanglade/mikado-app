import { Translations } from '@/tools/i18n/translation';

const translationEn: Translations = {
  test: 'test en',
  add: 'Add',
  cancel: 'Cancel',
  loading: 'Loading...',
  'documentation-link': '📕 Learn how to use the MikadoApp',
  'mikado-graph.start': 'Start',
  'mikado-graph.done': 'Great! You have completed your task!',
  'mikado-graph.error.emptyGoal': 'The goal cannot be empty',
  'mikado-graph.goal-and-objective': 'What is your objective?',
  'mikado-graph.your-goal': '<strong>Your goal</strong>: {goal}',
  'mikado-graph.placeholder': 'Explain your goal. For example: "I want to upgrade the version of the framework"',
  'mikado-graph.notification.success.start': 'You are ready to start working on your task',
  'prerequisite.label': '<strong>Prerequisite</strong>: {label}',
  'prerequisite.placeholder': 'Explain what you need to do to. For example: "I need to rename this method"',
  'prerequisite.add': 'Add a prerequisite',
  'prerequisite.notification.add-prerequisite.success': 'The prerequisite has been added',
  'prerequisite.notification.start-experimentation.success': 'You are starting to experiment with a prerequisite, good luck!',
  'prerequisite.start-experimentation': 'Start exploring',
  'prerequisite.commit-changes': 'Commit changes',
  'prerequisite.notification.success.commit-changes': 'Great, you have committed your changes. The experimentation is over!',
  'prerequisite.done': 'Great! You\'ve completed the prerequisite!',
  'prerequisite.error.emptyLabel': 'Please provide a label',
  'notification.error': 'Oops, something went wrong. Please try again.',
};
export default translationEn;

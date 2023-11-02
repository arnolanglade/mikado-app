import { Translations } from '@/tools/i18n/translation';

const translationEn: Translations = {
  test: 'test en',
  add: 'Add',
  cancel: 'Cancel',
  'mikado-graph.start': 'Start a task',
  'mikado-graph.done': 'Great! You have completed your task!',
  'mikado-graph.error.emptyGoal': 'The goal cannot be empty',
  'mikado-graph.goal-and-objective': 'What is your goal or objective?',
  'mikado-graph.your-goal': '<strong>Your goal</strong>: {goal}',
  'mikado-graph.notification.success.start': 'You are ready to start working on your task',
  'prerequisite.label': '<strong>Prerequisite</strong>: {label}',
  'prerequisite.add': 'Add a prerequisite',
  'prerequisite.notification.add-prerequisite.success': 'The prerequisite has been added',
  'prerequisite.notification.start-experimentation.success': 'You are starting to experiment with a prerequisite, good luck!',
  'notification.error': 'Oops, something went wrong. Please try again.',
  'prerequisite.start-experimentation': 'Start experimentation',
  'prerequisite.commit-changes': 'Commit changes',
  'prerequisite.notification.success.commit-changes': 'Great, you have committed your changes. The experimentation is over!',
  'prerequisite.done': 'Great! You\'ve completed the prerequisite!',
  'prerequisite.error.emptyLabel': 'Please provide a label',
};
export default translationEn;

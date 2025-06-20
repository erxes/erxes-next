import Element from './element';
import Itinerary from './itinerary';
import Tour from './tour';
import Order from './order';
import Branch from './branch';

export default {
  ...Element,
  ...Itinerary,
  ...Tour,
  ...Order,
  ...Branch,
};
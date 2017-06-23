'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './ufile.events';

var UfileSchema = new mongoose.Schema({
  filepath: String,
  date: String,
  active: Boolean
});

registerEvents(UfileSchema);
export default mongoose.model('Ufile', UfileSchema);

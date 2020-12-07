import axios from "axios";
import { url } from '../config'

export default axios.create({
  baseURL: url.server+"/api",
});
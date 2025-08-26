import type { Place } from "../types";

export const PLACES: Record<string, Place> = {
  Jaipur:{lat:26.9124,lng:75.7873, highlights:["Hawa Mahal","Amber Fort","Nahargarh Sunset"]},
  Kishangarh:{lat:26.5892,lng:74.8567, highlights:["Marble Market","Gundolav Lake"]},
  Ajmer:{lat:26.4499,lng:74.6399, highlights:["Ajmer Sharif Dargah","Ana Sagar Lake"]},
  Pushkar:{lat:26.4897,lng:74.5511, highlights:["Brahma Temple","Ghats","Cafe Street"]},
  Beawar:{lat:26.1012,lng:74.3203, highlights:["Local Dhaba Cluster"]},
  Bhilwara:{lat:25.3463,lng:74.6364, highlights:["Highway Food Stops"]},
  Rajsamand:{lat:25.0714,lng:73.8825, highlights:["Rajsamand Lake","Kankroli Temple"]},
  Udaipur:{lat:24.5854,lng:73.7125, highlights:["City Palace","Lake Pichola","Fateh Sagar"]},
  Chittorgarh:{lat:24.8790,lng:74.6297, highlights:["Chittorgarh Fort"]},
  Jodhpur:{lat:26.2389,lng:73.0243, highlights:["Mehrangarh Fort","Clock Tower"]},
};

export const DUMMY_IMG =
  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";

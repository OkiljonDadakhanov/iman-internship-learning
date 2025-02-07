import { Schema, model } from "mongoose";

export interface Jobs {
  title: string;
  type: string;
  description: string;
  location: string;
}

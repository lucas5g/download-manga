import { describe, it } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { app } from ".";

describe('e2e', () => {
  const api = treaty(app)
  it.only('create', async () => {
    const { data, error } = await api["create-epub"].post({
      name: 'kaiju-n-8-1',
      url: 'https://www.kaijuchapters.com/manga/jujutsu-kaisen-chapter-1-2/'
    })

    console.log(data)
  })
})
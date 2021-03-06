const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from("language")
      .select(
        "language.id",
        "language.name",
        "language.user_id",
        "language.head",
        "language.total_score"
      )
      .where("language.user_id", user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from("word")
      .select(
        "id",
        "language_id",
        "original",
        "translation",
        "next",
        "memory_value",
        "correct_count",
        "incorrect_count"
      )
      .where({ language_id });
  },

  getListHead(db, language_id) {
    return db
      .from("word")
      .join("language", "word.id", "language.head")
      .where("language.id", language_id)
      .first();
  },

  // update list in db
  persistDB(db, words, language_id, total_score) {
    return db.transaction(trx => {
      return Promise.all([
        db("language")
          .transacting(trx)
          .where({ id: language_id })
          .update({
            total_score,
            head: words[0].id
          }),
        ...words.map(word =>
          db("word")
            .transacting(trx)
            .where({ id: word.id })
            .update({
              ...word,
            })
        )
      ]);
    });
  }
};

module.exports = LanguageService;

function LanguageChart({ languages }) {
  if (!languages || languages.length === 0) {
    return (
      <div className="language-chart">
        <p>No programming language data available.</p>
      </div>
    );
  }

  return (
    <div className="language-chart">
      {languages.map((language, index) => (
        <div className="language-row" key={language.name || index}>
          <div className="language-header">
            <span className="language-name">
              {language.name}
            </span>

            <span className="language-stats">
              {language.repos} repos · {language.percentage}%
            </span>
          </div>

          <div className="language-bar">
            <div
              className="language-fill"
              style={{
                width: `${language.percentage}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LanguageChart;
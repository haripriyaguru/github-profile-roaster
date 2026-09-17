import { useState } from "react";
import LanguageChart from "./components/LanguageChart";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================================
     SEARCH GITHUB USER
  ================================= */

  const searchUser = async (searchUsername = username) => {
    const cleanUsername = searchUsername.trim();

    /* EMPTY USERNAME */

    if (!cleanUsername) {
      setError("Please enter a GitHub username.");
      return;
    }

    /* USERNAME VALIDATION */

    const githubUsernamePattern =
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,38}[a-zA-Z0-9])?$/;

    if (!githubUsernamePattern.test(cleanUsername)) {
      setError("Please enter a valid GitHub username.");
      return;
    }

    /* START LOADING */

    setLoading(true);
    setError("");
    setProfile(null);
    setRepositories([]);
    setLanguages([]);

    try {
      /* ================================
         FETCH PROFILE
      ================================= */

      const profileResponse = await fetch(
        `https://api.github.com/users/${cleanUsername}`
      );

      if (!profileResponse.ok) {
        if (profileResponse.status === 404) {
          throw new Error(
            "GitHub user not found. Check the username."
          );
        }

        if (profileResponse.status === 403) {
          throw new Error(
            "GitHub API rate limit reached. Please try again later."
          );
        }

        throw new Error(
          "Unable to fetch GitHub profile."
        );
      }

      const profileData =
        await profileResponse.json();

      /* ================================
         FETCH REPOSITORIES
      ================================= */

      const repoResponse = await fetch(
        `https://api.github.com/users/${cleanUsername}/repos?per_page=100&sort=updated`
      );

      if (!repoResponse.ok) {
        if (repoResponse.status === 403) {
          throw new Error(
            "GitHub API rate limit reached. Please try again later."
          );
        }

        throw new Error(
          "Unable to fetch repositories."
        );
      }

      const repoData =
        await repoResponse.json();

      console.log(
        "GitHub Profile:",
        profileData
      );

      console.log(
        "Repositories:",
        repoData
      );

      /* ================================
         LANGUAGE ANALYSIS
      ================================= */

      const languageMap = {};

      repoData.forEach((repo) => {
        if (repo.language) {
          languageMap[repo.language] =
            (languageMap[repo.language] || 0) + 1;
        }
      });

      const languageArray = Object.entries(
        languageMap
      )
        .map(([name, repos]) => ({
          name,
          repos,
        }))
        .sort(
          (a, b) => b.repos - a.repos
        );

      const totalLanguageRepos =
        languageArray.reduce(
          (sum, language) =>
            sum + language.repos,
          0
        );

      const languageStats =
        languageArray.map(
          (language) => ({
            ...language,
            percentage:
              totalLanguageRepos > 0
                ? Math.round(
                    (language.repos /
                      totalLanguageRepos) *
                      100
                  )
                : 0,
          })
        );

      console.log(
        "Languages:",
        languageStats
      );

      /* ================================
         SAVE DATA
      ================================= */

      setProfile(profileData);
      setRepositories(repoData);
      setLanguages(languageStats);
    } catch (err) {
      console.error(
        "GitHub API Error:",
        err
      );

      setProfile(null);
      setRepositories([]);
      setLanguages([]);

      setError(
        err.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     FORM SUBMIT
  ================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    searchUser();
  };

  /* ================================
     QUICK USER SEARCH
  ================================= */

  const handleQuickSearch = (name) => {
    setUsername(name);
    searchUser(name);
  };

  /* ================================
     ROAST LOGIC
  ================================= */

  const generateRoasts = () => {
    if (!profile) return [];

    const roasts = [];

    /* ================================
       REPOSITORIES
    ================================= */

    if (profile.public_repos === 0) {
      roasts.push({
        title: "No Repositories",
        text:
          "Your GitHub profile is basically an empty folder.",
        type: "roast",
      });
    } else if (
      profile.public_repos < 5
    ) {
      roasts.push({
        title: "Just Getting Started",
        text:
          "A few repositories. The GitHub journey has barely started.",
        type: "warning",
      });
    } else if (
      profile.public_repos >= 30
    ) {
      roasts.push({
        title: "Active Builder",
        text:
          "Okay, you actually build things. Respect.",
        type: "good",
      });
    } else {
      roasts.push({
        title: "Decent Builder",
        text:
          "You have enough repositories to prove you're not just watching tutorials.",
        type: "good",
      });
    }

    /* ================================
       BIO
    ================================= */

    if (!profile.bio) {
      roasts.push({
        title: "No Bio",
        text:
          "No bio? Bro really said 'let my code speak for itself.'",
        type: "roast",
      });
    } else {
      roasts.push({
        title: "Bio Detected",
        text:
          "You actually wrote a bio. Congratulations, humans can now understand what you do.",
        type: "good",
      });
    }

    /* ================================
       FOLLOWERS
    ================================= */

    if (profile.followers === 0) {
      roasts.push({
        title: "Invisible Developer",
        text:
          "Zero followers. Your code is currently living a private life.",
        type: "roast",
      });
    } else if (
      profile.followers >= 100
    ) {
      roasts.push({
        title: "Growing Influence",
        text:
          "Triple-digit followers. People are actually watching what you build.",
        type: "good",
      });
    } else if (
      profile.followers >= 20
    ) {
      roasts.push({
        title: "Growing Influence",
        text:
          "Your GitHub audience is growing. Not bad.",
        type: "neutral",
      });
    } else {
      roasts.push({
        title: "Small Audience",
        text:
          "The follower count is humble. Your code has room to build an audience.",
        type: "warning",
      });
    }

    /* ================================
       FOLLOWING
    ================================= */

    if (
      profile.following >
      profile.followers * 2
    ) {
      roasts.push({
        title: "Professional Follower",
        text:
          "You follow way more developers than follow you. Networking mode: activated.",
        type: "warning",
      });
    }

    /* ================================
       GISTS
    ================================= */

    if (profile.public_gists === 0) {
      roasts.push({
        title: "No Gist Zone",
        text:
          "No public gists. Apparently your random code snippets stay classified.",
        type: "neutral",
      });
    } else {
      roasts.push({
        title: "Snippet Dealer",
        text:
          "You have public gists. Sharing little pieces of chaos with the internet.",
        type: "good",
      });
    }

    /* ================================
       LANGUAGES
    ================================= */

    if (languages.length >= 5) {
      roasts.push({
        title: "Polyglot Coder",
        text:
          `You use ${languages.length} different languages. Someone clearly refuses to pick a favorite.`,
        type: "good",
      });
    } else if (
      languages.length === 1
    ) {
      roasts.push({
        title: "One Language Army",
        text:
          `Only ${languages[0].name}? Loyalty or fear of learning something new?`,
        type: "warning",
      });
    }

    /* ================================
       ACTIVITY
    ================================= */

    if (repositories.length > 0) {
      const latestRepo =
        repositories[0];

      const updatedDate =
        new Date(
          latestRepo.updated_at
        );

      const now = new Date();

      const difference =
        now.getTime() -
        updatedDate.getTime();

      const days =
        difference /
        (1000 * 60 * 60 * 24);

      if (days > 365) {
        roasts.push({
          title: "Missing in Action",
          text:
            "Your latest repository activity is ancient history. Hello? You still coding?",
          type: "roast",
        });
      } else if (days > 90) {
        roasts.push({
          title: "Taking a Break",
          text:
            "Your GitHub has been quiet lately. The code is waiting.",
          type: "warning",
        });
      } else {
        roasts.push({
          title: "Still Coding",
          text:
            "Recent activity detected. You're still alive and pushing code.",
          type: "good",
        });
      }
    }

    return roasts.slice(0, 6);
  };

  const roasts = generateRoasts();

  /* ================================
     PROFILE URL
  ================================= */

  const githubUrl =
    profile?.html_url ||
    `https://github.com/${username}`;

  /* ================================
     JSX
  ================================= */

  return (
    <div className="app">

      {/* =========================
          HEADER
      ========================= */}

      <header className="header">

        <div className="logo">

          <span className="logo-mark">
            G
          </span>

          <div>
            <h1>GitRoast</h1>

            <p>
              GitHub Profile Analyzer
            </p>
          </div>

        </div>

        <div className="header-badge">
          GITHUB API
        </div>

      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="main-container">

        {/* =========================
            HERO
        ========================= */}

        {!profile && (
          <section className="hero">

            <span className="eyebrow">
              GITHUB PROFILE ANALYZER
            </span>

            <h2>
              Your GitHub profile
              <br />
              deserves a roast.
            </h2>

            <p>
              Enter a GitHub username and
              discover their coding habits,
              stats, languages, and a
              brutally honest roast.
            </p>

            <form
              className="search-form"
              onSubmit={handleSubmit}
            >

              <div className="search-input-wrapper">

                <span className="search-icon">
                  @
                </span>

                <input
                  type="text"
                  value={username}
                  onChange={(event) =>
                    setUsername(
                      event.target.value
                    )
                  }
                  placeholder="GitHub username"
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Analyzing..."
                    : "Roast Me →"}
                </button>

              </div>

            </form>

            <div className="quick-search">

              <span>Try:</span>

              <button
                type="button"
                onClick={() =>
                  handleQuickSearch(
                    "torvalds"
                  )
                }
              >
                torvalds
              </button>

              <span>·</span>

              <button
                type="button"
                onClick={() =>
                  handleQuickSearch(
                    "octocat"
                  )
                }
              >
                octocat
              </button>

              <span>·</span>

              <button
                type="button"
                onClick={() =>
                  handleQuickSearch(
                    "gaearon"
                  )
                }
              >
                gaearon
              </button>

            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

          </section>
        )}

        {/* =========================
            RESULT
        ========================= */}

        {profile && (
          <>

            {/* PROFILE CARD */}

            <section className="profile-card">

              <div className="profile-image-wrapper">

                <img
                  src={profile.avatar_url}
                  alt={`${profile.login} avatar`}
                  className="profile-image"
                />

              </div>

              <div className="profile-content">

                <span className="eyebrow">
                  GITHUB USER
                </span>

                <h2>
                  {profile.name ||
                    profile.login}
                </h2>

                <p className="username">
                  @{profile.login}
                </p>

                <p className="bio">
                  {profile.bio ||
                    "No bio provided."}
                </p>

                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="github-link"
                >
                  View GitHub Profile ↗
                </a>

              </div>

            </section>

            {/* STATS */}

            <section className="stats-grid">

              <div className="stat-card">
                <strong>
                  {profile.public_repos}
                </strong>

                <span>
                  Repositories
                </span>
              </div>

              <div className="stat-card">
                <strong>
                  {profile.followers}
                </strong>

                <span>
                  Followers
                </span>
              </div>

              <div className="stat-card">
                <strong>
                  {profile.following}
                </strong>

                <span>
                  Following
                </span>
              </div>

              <div className="stat-card">
                <strong>
                  {profile.public_gists}
                </strong>

                <span>
                  Gists
                </span>
              </div>

            </section>

            {/* =========================
                ROAST
            ========================= */}

            <section className="roast-section">

              <div className="section-heading">

                <div>

                  <span>
                    BRUTALLY HONEST
                  </span>

                  <h2>
                    The Roast 🔥
                  </h2>

                </div>

              </div>

              <div className="roast-grid">

                {roasts.map(
                  (roast, index) => (
                    <div
                      className={`roast-card ${roast.type}`}
                      key={`${roast.title}-${index}`}
                    >

                      <h3>
                        {roast.title}
                      </h3>

                      <p>
                        {roast.text}
                      </p>

                    </div>
                  )
                )}

              </div>

            </section>

            {/* =========================
                LANGUAGE CHART
            ========================= */}

            <LanguageChart
              languages={languages}
            />

            {/* =========================
                RECENT REPOSITORIES
            ========================= */}

            <section className="repositories-section">

              <div className="section-heading">

                <div>

                  <span>
                    CODE ACTIVITY
                  </span>

                  <h2>
                    Recent Repositories
                  </h2>

                </div>

              </div>

              <div className="repository-grid">

                {repositories
                  .slice(0, 6)
                  .map((repo) => (

                    <a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="repository-card"
                    >

                      <div className="repository-header">

                        <h3>
                          {repo.name}
                        </h3>

                        <span>
                          ↗
                        </span>

                      </div>

                      <p>
                        {repo.description ||
                          "No description provided."}
                      </p>

                      <div className="repository-meta">

                        {repo.language && (
                          <span>
                            {repo.language}
                          </span>
                        )}

                        <span>
                          ⭐ {repo.stargazers_count}
                        </span>

                        <span>
                          🍴 {repo.forks_count}
                        </span>

                      </div>

                      <div className="repository-updated">

                        Updated{" "}
                        {new Date(
                          repo.updated_at
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}

                      </div>

                    </a>

                  ))}

              </div>

            </section>

            {/* =========================
                NEW SEARCH
            ========================= */}

            <section className="new-search-section">

              <button
                type="button"
                className="reset-button"
                onClick={() => {
                  setProfile(null);
                  setRepositories([]);
                  setLanguages([]);
                  setError("");
                  setUsername("");
                }}
              >
                ← Analyze Another Profile
              </button>

            </section>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

          </>
        )}

      </main>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="footer">

        <p>
          GitRoast · React · GitHub API ·
          Data-driven roasting
        </p>

      </footer>

    </div>
  );
}

export default App;
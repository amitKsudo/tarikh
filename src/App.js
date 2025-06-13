import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import React from "react";
import './App.css';

const months = [
  { name: "January", value: 1 },
  { name: "February", value: 2 },
  { name: "March", value: 3 },
  { name: "April", value: 4 },
  { name: "May", value: 5 },
  { name: "June", value: 6 },
  { name: "July", value: 7 },
  { name: "August", value: 8 },
  { name: "September", value: 9 },
  { name: "October", value: 10 },
  { name: "November", value: 11 },
  { name: "December", value: 12 }
];

function App() {
  const [month, setMonth] = React.useState(new Date().getMonth() + 1);
  const [day, setDay] = React.useState(new Date().getDate());
  const [year, setYear] = React.useState('');
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetchHistory(month, day);
  }, [month, day]);

  const fetchHistory = async (m, d) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://history.muffinlabs.com/date/${m}/${d}`);
      if (!res.ok) throw new Error("Failed to fetch history");
      const json = await res.json();

      if (!json.data || !Array.isArray(json.data.Events)) {
        throw new Error("Invalid response format");
      }

      setData(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = Array.isArray(data?.Events)
    ? data.Events.filter(event => (year ? event.year === year.toString() : true))
    : [];

  return (
    <div className="main-container">
      <h1><span className="tarikh-text">tārīḳh</span></h1>

      <div className="selectors">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          style={{ color: month ? '#fff' : '#fff' }}
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>{m.name}</option>
          ))}
        </select>

        <select value={day} onChange={(e) => setDay(Number(e.target.value))}>
          {[...Array(new Date(2025, month, 0).getDate())].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Filter by year"
          value={year}
          onChange={(e) => setYear(e.target.value.replace(/\D/g, ''))}
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {data && (
        <div className="events-container">
          <h2 className="events-heading">
            Events on {months.find(m => m.value === month)?.name} {day}
          </h2>
          <div className="events-list">
            {filteredEvents.length > 0 ? (
              <ul>
                {filteredEvents.map((event, index) => (
                  <li key={index}>
                    <strong>{event.year}:</strong> {event.text}{" "}
                    {event.links?.length > 0 && (
                      <a
                        href={`https://en.wikipedia.org/wiki/${event.links[0]?.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Read more
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No events found for this year.</p>
            )}
          </div>
        </div>
      )}
      <p className="disclaimer">
        &copy; 2025 <a href="https://amitt.tech" className="owner-link" target="_blank" rel="noopener noreferrer">Amit Kumar.</a>
        <a
          href="https://github.com/amitKsudo"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          <FontAwesomeIcon icon={faGithub} style={{ color: "#ffffff", fontSize: "10px" }} />
        </a>
      </p>
    </div>
  );
}

export default App;

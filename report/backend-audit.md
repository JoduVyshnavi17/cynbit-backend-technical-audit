

\# Cynbit – Backend Technical Audit Report



\*\*Prepared by:\*\* Backend Developer Intern Candidate  

\*\*Assessment:\*\* Backend Technical Assessment  

\*\*Date:\*\* 23 November 2026



\## 1. Objective



The objective of this audit is to evaluate Cynbit's publicly observable website behaviour from a backend developer's perspective and identify opportunities to improve API reliability, security, data handling, and performance.



This assessment uses passive browser observation only. No unauthorized access, exploitation, load testing, or disruptive testing was performed.



\## 2. Scope and Methodology



The following areas were reviewed:



\- Publicly accessible Cynbit website pages.

\- Candidate Application Progress Hub.

\- Browser Network requests and HTTP response statuses.

\- Observable page navigation and caching behaviour.

\- Publicly displayed contact and application workflows.



Internal source code, server configuration, database records, and private APIs were not accessed.



\## 3. Observed Technical Behaviour



\### 3.1 HTTP Responses



During browser inspection, the candidate page returned HTTP 200.



Several website navigation requests returned HTTP 200 and HTTP 304.



Google Analytics collection requests returned HTTP 204.



These responses indicate successful page delivery, cache validation, and analytics collection respectively.



\### 3.2 Frontend Navigation



Requests containing the `\_rsc` parameter were observed.



This pattern is consistent with Next.js React Server Components navigation. It is an observation of frontend behaviour and does not confirm the internal backend architecture.



\### 3.3 Candidate Application Hub



The candidate portal displays application progress, assessment stages, and a technical assessment submission workflow.



The page presents candidate-specific information. Such information should be protected through appropriate authentication and server-side authorization.



The actual implementation of these protections could not be verified through the available browser observations.



\## 4. Security Findings and Recommendations



\### Finding 1: Candidate Data Protection



\*\*Category:\*\* Security and Privacy



Candidate portals handle personal and application-related information.



\*\*Recommendation:\*\*



\- Require authenticated access to candidate records.

\- Verify record ownership on every server-side request.

\- Avoid exposing unnecessary personal information in API responses.

\- Use secure session cookies or appropriately managed tokens.

\- Apply HTTPS throughout the application.

\- Apply appropriate access controls to candidate-specific documents and submissions.



\### Finding 2: Input Validation



\*\*Category:\*\* Data Validation



Application and contact forms should validate incoming data on the server, even when browser-side validation is present.



\*\*Recommendation:\*\*



\- Validate email addresses and required fields.

\- Apply maximum field lengths.

\- Reject unexpected properties.

\- Return consistent validation errors.

\- Normalize and sanitize input where appropriate for its intended use.



\### Finding 3: API Error Handling



\*\*Category:\*\* Reliability



API failures should return predictable error responses without exposing internal implementation details.



\*\*Recommendation:\*\*



\- Use appropriate HTTP status codes.

\- Return consistent JSON error structures.

\- Log technical details securely on the server.

\- Avoid returning stack traces or sensitive information.

\- Handle malformed JSON and unexpected server errors gracefully.



\## 5. Performance Findings and Recommendations



\### Finding 4: Page Response Timing



The observed candidate-page request took approximately 2.35 seconds in one browser session.



This is a single observation and does not establish a performance bottleneck.



\*\*Recommendation:\*\*



\- Measure response times over multiple sessions.

\- Monitor server-side request duration.

\- Optimize database queries.

\- Cache suitable non-sensitive public content.

\- Avoid caching private candidate information in shared caches.

\- Monitor response sizes and application resource usage.



\### Finding 5: Cache Behaviour



Some navigation requests returned HTTP 304.



This indicates cache validation and is generally beneficial.



\*\*Recommendation:\*\*



\- Configure appropriate Cache-Control and ETag behaviour.

\- Use conservative caching for authenticated candidate data.

\- Avoid shared caching of private application records.

\- Review cache policies for public and private endpoints separately.



\## 6. Recommended Backend Architecture



A maintainable backend could use the following logical structure:



```text

Client / Browser

&#x20;      |

&#x20;      v

API Layer

&#x20;      |

&#x20;      v

Authentication and Authorization

&#x20;      |

&#x20;      v

Validation Layer

&#x20;      |

&#x20;      v

Business Logic / Services

&#x20;      |

&#x20;      v

Database Layer

&#x20;      |

&#x20;      v

Persistent Database

```



\### Recommended Components



\- Node.js and Express or NestJS for API services.

\- PostgreSQL for production relational data.

\- Input validation using Zod.

\- Authentication and server-side authorization.

\- Structured application logging.

\- Rate limiting for sensitive endpoints.

\- Automated API and integration tests.

\- Environment-based configuration and secret management.



This is a recommended architecture, not a claim about Cynbit's actual internal implementation.



\## 7. Demonstration Implementation



To demonstrate the recommended backend practices, I developed a separate Express and SQLite API.



The implementation includes:



\- REST endpoint for inquiry submission.

\- Server-side validation using Zod.

\- Security headers using Helmet.

\- Rate limiting using express-rate-limit.

\- SQLite persistence using parameterized SQL queries.

\- JSON request body size limit.

\- Standard success, validation, and error responses.

\- Automated tests using Jest and Supertest.



\### 7.1 Demonstration API Contract



The following examples describe the independently developed demonstration API. They are not captured Cynbit production API requests or responses.



\*\*Endpoint:\*\*



`POST /api/v1/inquiries`



\*\*Example request:\*\*



```json

{

&#x20; "name": "Test Candidate",

&#x20; "email": "candidate@example.com",

&#x20; "company": "Example Company",

&#x20; "message": "I would like to submit an inquiry."

}

```



\*\*Successful response – HTTP 201:\*\*



```json

{

&#x20; "success": true,

&#x20; "message": "Inquiry submitted successfully",

&#x20; "data": {

&#x20;   "id": 1,

&#x20;   "status": "received"

&#x20; }

}

```



\*\*Validation error – HTTP 400:\*\*



```json

{

&#x20; "success": false,

&#x20; "message": "Validation failed",

&#x20; "errors": \[

&#x20;   {

&#x20;     "field": "email",

&#x20;     "message": "Invalid email"

&#x20;   }

&#x20; ]

}

```



The demonstration API validates incoming data before database insertion and returns a consistent response structure.



\### 7.2 Parameterized SQL Query



The demonstration implementation uses parameterized SQL queries for database insertion.



```javascript

const insert = db.prepare(`

&#x20;   INSERT INTO inquiries (name, email, company, message)

&#x20;   VALUES (?, ?, ?, ?)

`);



const result = insert.run(

&#x20;   name,

&#x20;   email,

&#x20;   company || null,

&#x20;   message

);

```



Parameterized queries separate SQL instructions from user-provided values and help prevent SQL injection through this database operation.



\### 7.3 Testing



The demonstration API includes automated tests using Jest and Supertest.



The tests cover:



\- Health endpoint response.

\- Successful inquiry submission.

\- Rejection of invalid email input.

\- Handling of unknown routes.

\- Verification that submitted inquiry data is saved in SQLite.



The tests were executed locally and passed.



\### 7.4 Implementation Limitations



The demonstration is a local reference implementation and is not connected to Cynbit's production systems.



The following improvements would be appropriate before using it in a production environment:



\- Replace SQLite with a managed PostgreSQL database for a multi-instance production deployment.

\- Use a shared rate-limit store when running multiple application instances.

\- Configure the server port and other settings through environment variables.

\- Add authentication and authorization for administrative or private data access.

\- Add structured logging and monitoring.

\- Configure automated database backups and recovery procedures.

\- Review and update dependencies regularly.



\## 8. Observed HTTP Behaviour and Evidence



\### 8.1 Browser Network Observations



During a passive review of the publicly accessible website, browser Developer Tools were used to observe normal page navigation and network responses. No intrusive testing, exploitation, or unauthorized access was performed.



| Observed request | HTTP status | Approximate duration | Interpretation |

|---|---:|---:|---|

| Candidate page request | 200 | 2.35 s | The request completed successfully |

| Navigation requests | 304 | 66–82 ms | The browser received a Not Modified response during cache validation |

| Careers page navigation | 200 | 287 ms | The request completed successfully |

| Internship page navigation | 200 | 279 ms | The request completed successfully |

| Blog page navigation | 200 | 264 ms | The request completed successfully |

| Analytics collection requests | 204 | 69 ms | The analytics endpoint returned No Content |



\### 8.2 Technical Interpretation



\- \*\*HTTP 200 – OK:\*\* The server successfully processed the request.

\- \*\*HTTP 304 – Not Modified:\*\* The response indicates that the browser can reuse its cached representation. This is consistent with conditional HTTP caching.

\- \*\*HTTP 204 – No Content:\*\* The request was processed successfully without a response body. This is normal for many analytics collection requests.

\- \*\*`\_rsc` query parameter:\*\* The observed navigation requests included `\_rsc` parameters. This is consistent with Next.js React Server Components navigation. It does not establish the complete backend architecture or database technology.



\### 8.3 Performance Considerations



One candidate-page request took approximately 2.35 seconds in the observed browser session. This is a single measurement and cannot establish a persistent performance bottleneck.



A more reliable performance assessment would require repeated measurements under controlled conditions, including:



\- Time to First Byte (TTFB).

\- Total page response time.

\- Response payload size.

\- Server-side processing time, where available.

\- Performance under representative concurrent traffic.



\### 8.4 Evidence Limitations



These observations describe browser-visible HTTP behaviour only. They do not prove the existence of a particular backend framework, database, authentication implementation, or internal API design.



No internal source code, private API, database, server logs, or production infrastructure was accessed.



The findings in this report therefore distinguish between directly observed behaviour, potential areas for further verification, and recommended backend engineering practices.



\## 9. Conclusion



The passive review identified observable HTTP response patterns, frontend navigation behaviour, and candidate-portal data protection considerations.



The available evidence does not establish any confirmed security vulnerability or internal backend defect. The recommendations in this report are intended as engineering improvements and areas for further verification.



The independent demonstration API shows how input validation, secure HTTP headers, rate limiting, persistent data storage, consistent error handling, and automated testing can be applied in a practical backend implementation.



This assessment demonstrates a structured approach to backend analysis, evidence-based reporting, and implementation of recommended engineering practices.

```



\## Save the file



1\. Open Command Prompt.

2\. Run:



```cmd

cd C:\\Users\\joduv\\Documents\\cynbit-backend-audit

notepad report\\backend-audit.md

```



3\. Press \*\*Ctrl + A\*\* in Notepad.

4\. Delete the old content and paste the complete report above.

5\. Press \*\*Ctrl + S\*\* and close Notepad.



\*\*One important submission precaution:\*\* Before publishing to GitHub, check that the report contains no candidate-specific URL, reference code, email address, or personal details. The example data above is fictional.



Once saved, tell me \*\*"Saved"\*\* and we'll verify the report and move on to the GitHub submission.


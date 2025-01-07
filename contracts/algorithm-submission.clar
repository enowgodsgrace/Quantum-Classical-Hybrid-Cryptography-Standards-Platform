;; Algorithm Submission and Certification Contract

(define-data-var algorithm-count uint u0)

(define-map algorithms
  uint
  {
    submitter: principal,
    name: (string-ascii 100),
    description: (string-utf8 1000),
    implementation: (string-utf8 10000),
    status: (string-ascii 20),
    certification-date: (optional uint)
  }
)

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u403))
(define-constant ERR_INVALID_ALGORITHM (err u404))

(define-public (submit-algorithm (name (string-ascii 100)) (description (string-utf8 1000)) (implementation (string-utf8 10000)))
  (let
    (
      (algorithm-id (+ (var-get algorithm-count) u1))
    )
    (map-set algorithms
      algorithm-id
      {
        submitter: tx-sender,
        name: name,
        description: description,
        implementation: implementation,
        status: "pending",
        certification-date: none
      }
    )
    (var-set algorithm-count algorithm-id)
    (ok algorithm-id)
  )
)

(define-public (certify-algorithm (algorithm-id uint))
  (let
    (
      (algorithm (unwrap! (map-get? algorithms algorithm-id) ERR_INVALID_ALGORITHM))
    )
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (ok (map-set algorithms
      algorithm-id
      (merge algorithm
        {
          status: "certified",
          certification-date: (some block-height)
        }
      )
    ))
  )
)

(define-public (revoke-certification (algorithm-id uint))
  (let
    (
      (algorithm (unwrap! (map-get? algorithms algorithm-id) ERR_INVALID_ALGORITHM))
    )
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (ok (map-set algorithms
      algorithm-id
      (merge algorithm
        {
          status: "revoked",
          certification-date: none
        }
      )
    ))
  )
)

(define-read-only (get-algorithm (algorithm-id uint))
  (map-get? algorithms algorithm-id)
)

(define-read-only (get-algorithm-count)
  (var-get algorithm-count)
)


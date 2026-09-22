window.P_AUDIENCE = [

/* ============================================================ LANDLORDS */
{
  path: "/for-business/landlords",
  kind: "role",
  title: "Documents for landlords",
  h1: "The document stack for a residential landlord",
  lede: "A tenancy uses about nine documents across its life, and most landlords meet them one emergency at a time. **This is the whole set in the order the year actually uses them** — what each one does, when it is due, and what happens if it is missing.",
  job: "Give a landlord the complete document stack for a residential tenancy, sequenced by when each one is needed.",
  voice: [
    "What paperwork do I actually need as a landlord?",
    "I've got three units now and I'm losing track of what I'm meant to send when.",
    "What should I have on file for every tenant?",
    "Is there a checklist of everything a landlord needs for a rental?"
  ],
  secs: [
    {
      h: "The stack, in the order the year uses it",
      b: [
        { a: "Nine documents, in four phases. Two before anybody moves in, one to create the tenancy, three during it, and three to end it. A landlord holding all nine for every unit has almost no paperwork emergencies; the ones who do not, have them routinely." },
        { table: { c: ["Phase", "Document", "When it is needed"], r: [
          ["Screening", "[Rental application](/agreements/real-estate/rental-application)", "From every adult applicant, before you check anything about them"],
          ["Screening", "Adverse action notice", "Within a reasonable time of declining anyone because of a screening report"],
          ["Creating the tenancy", "[Residential lease](/agreements/real-estate/residential-lease-agreement) or [month-to-month agreement](/agreements/real-estate/month-to-month-rental-agreement)", "Signed by both sides before keys change hands"],
          ["Creating the tenancy", "Disclosures and move-in condition report", "Attached to the lease; the report signed on the day. See [the move-in day](/use-cases/new-tenant-moving-in)"],
          ["During the tenancy", "Notice of entry", "Before each non-emergency visit, per your state's period"],
          ["During the tenancy", "Rent increase notice", "Only for periodic tenancies, or at renewal"],
          ["During the tenancy", "Notice to pay or cure", "When rent is late or a lease term is breached"],
          ["Ending it", "[Lease renewal](/agreements/real-estate/lease-renewal-agreement)", "60 to 90 days before the term ends, if you want another fixed term"],
          ["Ending it", "[Notice to vacate](/agreements/real-estate/notice-to-vacate) or [termination agreement](/agreements/real-estate/lease-termination-agreement)", "One-sided ending, or mutual early exit"],
          ["Ending it", "Deposit itemisation and refund", "Within your state's deadline after possession returns"]
        ] } }
      ]
    },
    {
      h: "What to keep on file for every tenancy",
      b: [
        { a: "One folder per unit per tenancy, containing seven things. If a dispute reaches a court or an inspector, this folder is the case — and a landlord who can produce it usually does not end up in front of either." },
        { cards: [
          { h: "The signed application", p: "With the consent language, plus the screening report and a note of the criteria applied." },
          { h: "The lease and every attachment", p: "Fully signed, with the disclosures. Not a photograph of the signature page." },
          { h: "The move-in condition report", p: "Signed by both, with dated photographs kept as originals." },
          { h: "The rent ledger", p: "Every payment, the date received, the method, and what period it covered." },
          { h: "Repair correspondence", p: "Every request and every response, dated. Ideally through one email address used for nothing else." },
          { h: "Every notice served", p: "The notice itself plus proof of how and when it was served." },
          { h: "The move-out file", p: "The out report, the itemisation, the invoices behind each deduction, and proof the refund was sent." }
        ] },
        { note: { k: "good", t: "Keep it for the limitations period, not the tenancy", d: "A tenant can generally bring a claim for some years after the tenancy ends, and the length depends on the state and the type of claim. Keep the folder for at least that long. Storage is cheap; reconstructing a rent ledger from memory is not possible." } }
      ]
    },
    {
      h: "The recurring obligations a document does not remind you about",
      b: [
        { ul: [
          "**Habitability.** Heat, hot water, plumbing, electrics, structural safety and working locks, throughout the tenancy. Implied in most states and not waivable by agreement.",
          "**Notice before entry.** Most states require advance written notice for non-emergency access, commonly twenty-four hours, with permitted purposes. See [quiet enjoyment](/glossary/quiet-enjoyment).",
          "**Deposit handling.** Several states require the deposit to be held in a separate or interest-bearing account, and to tell the tenant in writing where it is.",
          "**Alarms.** Smoke and carbon-monoxide detectors installed, tested and, in many states, documented at move-in.",
          "**No retaliation.** In most states an increase, a notice or a refusal to renew that closely follows a tenant complaint or a code report is presumed retaliatory.",
          "**Fair housing.** Applies to advertising, screening, rules, renewals and terminations — not only to the decision to rent."
        ] }
      ]
    },
    {
      h: "How the stack changes with scale",
      b: [
        { table: { c: ["", "One unit", "Two to nine units", "Ten or more"], r: [
          ["Documents", "The nine above, per tenancy", "The same, plus a written standard set so every unit is let on identical terms", "The same, plus a documented policy for screening, maintenance and notices"],
          ["Record keeping", "A folder and a spreadsheet", "A shared drive with one folder per unit, and a single rent ledger", "Property management software; reconstructing from files stops being viable"],
          ["Screening", "Consistency you can hold in your head", "Written criteria, because more than one person now applies them", "A policy document, because a fair-housing complaint tests the policy, not the decision"],
          ["Legal exposure", "One tenancy", "One mistake repeated across every unit", "Class exposure: a defective clause in a standard lease is defective in all of them"],
          ["Usual next step", "Self-manage", "Decide whether to self-manage", "[Property management](/industries/property-management), or an employee"]
        ] } },
        "The change worth noticing is the third row. With one tenancy, consistency is a habit. With several, it has to be written down — not because the law is different, but because a landlord defending a screening decision is defending the criteria they applied, and criteria that exist only in somebody's judgement cannot be evidenced."
      ]
    }
  ],
  faq: [
    { q: "Do I need different leases for different states?", a: "The body of the lease travels; the disclosures, deposit rules, notice periods and fee caps do not. Keep one structure and swap the state-specific parts, and treat a lease that has been used unchanged in a second state as a lease that has not been checked for that state." },
    { q: "Should I hold the deposit in a separate account?", a: "In several states you must, and some also require it to bear interest and require you to tell the tenant in writing where it is held. Even where nothing requires it, a separate account is worth keeping: it makes the deposit provably intact, and it prevents it being spent by accident, which is the origin of a surprising number of deposit disputes." },
    { q: "How long should I keep tenant records?", a: "At least as long as the limitations period for claims in your state, which commonly runs for several years after the tenancy ends and varies by the type of claim. Screening records are worth keeping on the same footing, because a fair-housing complaint is defended with the file for the applicant who was declined as much as the one who was accepted." },
    { q: "Can I use one lease for a house share with separate rooms?", a: "You can let the whole property to all the sharers on one lease, which makes them jointly and severally liable, or let each room separately on its own lease, which makes each tenant liable only for their own rent and makes you responsible for filling vacancies. They are genuinely different businesses. See [joint and several liability](/glossary/joint-and-several-liability) and the [roommate agreement](/agreements/real-estate/roommate-agreement)." },
    { q: "What is the one document landlords most often skip?", a: "The move-in condition report, and it is the one that costs the most to be without. Every contested deposit deduction is decided by comparing the property at the end against the property at the start, and a landlord with no record of the start has no deduction they can prove." }
  ],
  rel: [
    { p: "/use-cases/renting-out-your-first-property", w: "If this is your first tenancy, work through the situation first and come back to the stack." },
    { p: "/agreements/real-estate", w: "All nine documents, with the routing question that picks between them." },
    { p: "/industries/property-management", w: "What changes when somebody else runs the stack on your behalf." },
    { p: "/use-cases/tenant-stopped-paying-rent", w: "The one situation where having the full file stops being administrative and starts being the case." }
  ],
  cta: { h: "Build the stack once, reuse it every tenancy.", p: "BizDraft keeps your property details and your state's rules and produces each document in the set as the tenancy reaches it.", b1: "Start a draft", b2: "Browse the documents", b2p: "/agreements/real-estate" }
},

/* ============================================================ PROPERTY MANAGEMENT */
{
  path: "/industries/property-management",
  kind: "industry",
  title: "Property management",
  h1: "Documents for property management companies",
  lede: "A property manager signs in somebody else's name, holds somebody else's deposits and makes decisions that bind somebody else's asset. **The management agreement is what makes any of that lawful**, and it is the document most often treated as a formality.",
  job: "Cover the documents a managing agent needs on top of the tenancy stack, and the authority questions they turn on.",
  voice: [
    "I'm managing three buildings for an owner, what do I need in writing with them?",
    "Who holds the security deposits when an agent manages the property?",
    "Can a property manager sign a lease on the owner's behalf?",
    "What happens to the tenants if the owner changes management company?"
  ],
  secs: [
    {
      h: "What property management adds to the tenancy stack",
      b: [
        { a: "Managers use the same nine tenancy documents as any landlord. What they add is a second layer governing their own relationship with the owner: the management agreement, the authority it grants, the handling of the owner's money, and the records the owner is entitled to." },
        { cards: [
          { h: "Management agreement", p: "The contract with the owner: scope, fees, term, authority limits, indemnity, termination and what happens to the files at the end." },
          { h: "Authority schedule", p: "The spend limit above which the owner must approve, and who may sign a lease, serve a notice or start an eviction." },
          { h: "Trust account arrangements", p: "Where rent and deposits are held, how they are reconciled, and how often the owner receives a statement." },
          { h: "Owner reporting pack", p: "Monthly statement, rent roll, arrears, maintenance ledger, and a year-end summary for the owner's return." },
          { h: "Vendor agreements", p: "Contractors engaged for the owner's property, with insurance and licensing evidenced." },
          { h: "Handover pack", p: "What transfers when management ends: leases, deposits, condition reports, keys, ledgers, correspondence." }
        ] }
      ]
    },
    {
      h: "The management agreement: what it has to settle",
      b: [
        { a: "Six things, and an agreement silent on any of them will be argued about at the exact moment nobody can afford the argument — a disputed eviction, a large repair, or a change of agent." },
        { ul: [
          "**Scope.** Letting only, letting and management, or full management including capital works. Whether the manager handles evictions and at whose cost.",
          "**Authority and spending limits.** The figure above which the owner must approve a repair, and the emergency exception. Who may sign a lease, serve a notice or file an eviction in the owner's name.",
          "**Fees.** The management percentage, the letting fee, renewal fees, and any markup on maintenance — disclosed explicitly, because an undisclosed markup is the most common source of conflict between owners and agents.",
          "**Money handling.** Which account holds rent and which holds deposits, how often the owner is paid out, and how the account is reconciled.",
          "**Liability and insurance.** Who carries what risk, the manager's professional and general liability cover, the owner's landlord policy, and indemnity in both directions.",
          "**Termination and handover.** Notice to end the arrangement, whether fees survive on tenancies the manager placed, and a specific list of what is handed over and by when."
        ] },
        { note: { k: "warn", t: "Licensing is a threshold question", d: "Most states regulate property management as a real estate activity: managing property for another for compensation commonly requires a real estate broker's licence or a specific property management licence, and the rules on trust accounts and record retention come with it. Unlicensed management can void the fee agreement entirely in some states. Confirm the requirement before signing an owner, not after." } }
      ]
    },
    {
      h: "Who holds the deposits, and whose name is on the lease",
      b: [
        { a: "The tenant's counterparty is the landlord, and in most arrangements that remains the owner — the manager signs as agent, and the lease should say so, naming the owner as landlord and the manager as authorised agent. Deposits are usually held by the manager in a trust or escrow account on the owner's behalf, subject to the state's rules on separation, interest and disclosure." },
        "Getting this wrong has consequences on both sides. A lease that names the manager as landlord can make the manager personally liable for the landlord's obligations, including the return of the deposit. A lease that names neither clearly leaves a tenant unable to tell who to serve a notice on, which is a defect that helps nobody.",
        "Most states also require the tenant to be given the name and address of the person authorised to receive notices and manage the property — one of the few disclosures that exists specifically because of managed tenancies.",
        { note: { k: "info", t: "When management changes", d: "The tenancy does not change. Leases continue on their terms, and deposits transfer to the new holder with an accounting. The tenants should be told in writing who now manages the property, where to pay rent, where to report repairs and who holds their deposit — and the outgoing manager should hand over the condition reports, because a deposit without its move-in report is a deposit that will have to be returned in full." } }
      ]
    },
    {
      h: "Where managed portfolios actually go wrong",
      b: [
        { table: { c: ["Failure", "What it looks like", "The document that prevents it"], r: [
          ["Authority exceeded", "A repair authorised above the limit, or an eviction started without instruction", "Authority schedule with a stated figure and an emergency exception"],
          ["Condition reports missing", "A deposit cannot be deducted against because nobody has the move-in record", "Standard move-in process, with the report filed centrally per unit"],
          ["Deposit commingling", "Deposits held in the operating account and spent in the ordinary course", "Trust account terms, reconciled monthly"],
          ["Inconsistent screening", "Different staff applying different criteria across a portfolio", "Written screening policy, applied portfolio-wide"],
          ["Defective standard lease", "One unenforceable clause replicated across every unit", "Annual review of the standard lease against each state's law"],
          ["Handover disputes", "An outgoing manager holding files, keys or deposits", "Termination clause listing exactly what transfers, and by when"]
        ] } },
        "The fourth and fifth rows are the ones that scale badly. A single landlord's inconsistent screening is one decision to defend; a portfolio's is a pattern, and patterns are what fair-housing enforcement examines. A defective clause in one lease is one problem; in a standard lease used across four hundred units it is four hundred."
      ]
    }
  ],
  faq: [
    { q: "Does a property manager need a licence?", a: "In most states, yes — managing residential property for another for compensation is usually a licensed real estate activity, requiring a broker's licence or a dedicated property management licence, and bringing trust-account and record-keeping rules with it. A few states exempt on-site managers of a single property or salaried employees of the owner. Check your state before you take a fee." },
    { q: "Should the lease name the owner or the management company?", a: "Name the owner as landlord and the management company as authorised agent, signing as agent. Naming the manager as landlord can transfer the landlord's obligations to them personally, including deposit liability. Most states separately require the tenant to be told who is authorised to receive notices, which the same clause can satisfy." },
    { q: "Who returns the deposit when management changes mid-tenancy?", a: "Whoever holds it when the tenancy ends, and the obligation follows the money and the property. On a change of manager, the deposits transfer with a written accounting, and the move-in condition reports transfer with them — a deposit without its baseline report is very difficult to deduct from and is usually returned in full." },
    { q: "Can a manager start an eviction in the owner's name?", a: "Only if the management agreement grants that authority, and in several states only a licensed person or an attorney may bring the action, with some jurisdictions requiring the owner or an attorney specifically. Get the authority in writing and confirm who may appear before the first case, not during it." },
    { q: "What should an owner receive every month?", a: "A statement of rent collected against rent due, arrears by unit with their status, maintenance spend with invoices, the fee charged, and the amount remitted. Anything less than a rent roll plus an expense ledger leaves an owner unable to check the arithmetic, which is where most owner-agent relationships come apart." }
  ],
  rel: [
    { p: "/for-business/landlords", w: "The tenancy stack a manager operates on the owner's behalf." },
    { p: "/agreements/real-estate", w: "The nine tenancy documents themselves, with the routing question between them." },
    { p: "/glossary/security-deposit", w: "The money a manager holds for somebody else, and the rules that attach to it." },
    { p: "/agreements/real-estate/rental-application", w: "The screening step that has to be consistent across an entire portfolio, not just one let." }
  ],
  cta: { h: "Standardise the stack across the portfolio.", p: "BizDraft keeps one document set per state and produces each tenancy's paperwork from it, so a clause fixed once is fixed everywhere.", b1: "Start a draft", b2: "See the landlord stack", b2p: "/for-business/landlords" }
}

];

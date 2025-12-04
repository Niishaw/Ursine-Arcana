# ADR 0004 — Species, Roles, and Tags Taxonomy

**Date:** 2024-12-04  
**Status:** accepted

## Context

Ursine Arcana serves the furry, pup-play, and fetish communities. Users need to express their identity through species selection, community roles/tribes, relationship intentions, sexual position, and interest/kink tags.

These fields must balance:

1. Community authenticity (using familiar terminology)
2. Legal compliance (POPIA special personal information rules)
3. User experience (not overwhelming, but comprehensive)

Sources consulted:

- Furscience (academic furry research)
- WikiFur (community wiki)
- Grindr (industry standard for LGBTQ+ apps)

## Decision

### 1. Species (32 options + custom)

Predefined species derived from Furscience/WikiFur popularity data:

**Canines**: Wolf, Fox, Dog (Husky), Dog (Generic)  
**Felines**: Cat (Domestic), Tiger, Lion, Leopard, Snow Leopard  
**Mythical**: Dragon, Gryphon, Unicorn, Phoenix, Sergal  
**Mustelids**: Otter, Ferret  
**Bears**: Bear  
**Rodents**: Rat/Mouse, Squirrel, Rabbit  
**Other Mammals**: Raccoon, Deer, Horse, Hyena, Skunk, Goat, Cow, Kangaroo, Wombat  
**Aquatic/Reptiles**: Shark, Seal, Reptile/Serpent, Lizard  
**Custom**: "Other / Create your own" (free text, max 50 chars)

**POPIA Classification**: Species is NOT special personal information. No special consent required.

### 2. Tribes (15 options, multi-select)

Mirroring Grindr with furry-specific additions:

Bear, Twink, Jock, Otter, Daddy, Clean-Cut, Geek, Leather, Rugged, Poz, Trans, Discreet, Pup, Handler, Fursuiter

**POPIA Classification**: Some tribes imply sexual identity/preferences. Entire field requires special consent under POPIA Section 26.

### 3. Looking For (6 options, multi-select)

Chat, Dates, Friends, Networking, Relationship, Hookups

**POPIA Classification**: "Hookups" implies sex life. Entire field requires special consent.

### 4. Position (7 options, single-select)

Top, Vers Top, Versatile, Vers Bottom, Bottom, Side, No Response

**POPIA Classification**: Explicitly sex life data. Requires special consent.

### 5. Tags (curated taxonomy, multi-select)

Organized into categories with consent requirements:

| Category           | Examples                             | POPIA Special? |
| ------------------ | ------------------------------------ | -------------- |
| Identity           | Furry, Therian, Artist, Fursuiter    | No             |
| Interests          | Conventions, Art, Gaming, Fitness    | No             |
| Relationship Style | Monogamous, Open, Polyamorous        | Yes            |
| Kink Role          | Dominant, Submissive, Handler, Pup   | Yes            |
| Activities         | Pup Play, Pet Play, Leather, Bondage | Yes            |
| Gear               | Pup Hood, Collar, Harness, Fursuit   | Yes            |

**Implementation**: Tags requiring special consent are only visible/editable after user provides POPIA special consent.

### 6. Consent Gating

- Fields NOT requiring special consent: Species, Bio, Display Name, Profile Photo
- Fields REQUIRING special consent: Tribes, Looking For, Position, Tags (certain categories)

Users who decline special consent can still use the app but cannot set or view these fields on other profiles.

## Consequences

**Positive:**

- Comprehensive identity expression for target communities
- POPIA compliant with clear consent boundaries
- Familiar terminology for Grindr users
- Furry-specific options not found on mainstream apps

**Negative:**

- Consent gating adds friction to onboarding
- Users declining consent have reduced functionality
- Taxonomy requires ongoing maintenance as community evolves

**Future Considerations:**

- User-submitted tag requests (moderated)
- Regional tag variations
- Periodic taxonomy review based on usage data

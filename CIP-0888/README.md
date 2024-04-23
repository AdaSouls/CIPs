---
CIP: 888
Title: Soulbound Tokens
Status: Draft
Category: Tokens
Authors:
  - Matías Falcone <matias.falcone@gmail.com>
  - Leobel Izquierdo <leobelizquierdo@gmail.com>
Implementors:
  - Matías Falcone (AdaSouls)
  - Leobel Izquierdo (AdaSouls)
Discussions:
  - https://forum.cardano.org/t/soulbound-tokens-in-cardano/112379
Created: 2024-03-14
License: CC-BY-4.0
---

## Abstract

This proposal defines a Metadata Standard for Soulbound Tokens.

## Motivation: why is this CIP necessary?

Contrary to Tokens, that are part of the ledger, Soulbound Tokens, which are typically associated with non-fungible tokens that are permanently linked or bound to a specific user, item, or identity (and thus cannot be transferred), are not natively supported in Cardano.

This is why we propose this CIP: as there is no native way to prevent users from transferring tokens from their wallet to another wallet, we have to come up with a standard to support this feature. 

This is done as part of what we call **Soulbound Tokens Collections**`**.

A collection of SBTs represents a particular group or category. Each SBT within a collection is intended for a specific purpose and is tied to certain credentials.

For example, we might have a collection called "University X: Engineering Graduates". The tokens within this collection would be tied to the credentials of individuals who have graduated from Engineering at University X. This could include information such as the graduate's name, graduation year, and other relevant data. Another collection example could be "Members of Chess Club Y", where the tokens would be associated with the credentials of the members of a specific chess club.

## Implementation: how does it work?

The implementation allows developers to define constraints on each SBT collection (like a native script), a beneficiary and an **`Issued`** status. The tokens go to a script address that also adheres to the same constraints and additionally checks that the claimant matches the beneficiary and that the token status is **`Issued`**. If everything is okay, the `claim` only modifies the status to **`Claimed`** and sends it to the same address as before. This means that tokens in **`Claimed`** status could only be claimed by unique beneficiaries, certifying that the credential belongs to them, despite not being in their wallet.

Finally, burning a token is allowed by anyone who meets the criteria that was initially stated in the policy (for example, they are among the signers). The token can be in either **`Issued`** or **`Claimed`** status. So even if the beneficiary claimed the token, it can be burnt.

## Specification

This is the registered `transaction_metadatum_label` value

| transaction_metadatum_label | description  |
| --------------------------- | ------------ |
| 888                         | Soulbound Token Metadata |

### General Metadata Structure

```
{
  "888": {
    "<policy_id>": {
      "<asset_name>": {
        "name": <string>,
        "image": <uri | array>,
        "mediaType": image/<mime_sub_type>,
        "description": <string | array>,
        "files": [{
          "name": <string>,
          "mediaType": <mime_type>,
          "src": <uri | array>,
          <other_properties>
        }],
        <other properties>
      }
    }
  }
}
```

### General Datum Structure

```
{
  "beneficiary": <payment_credential_hash>,
  "status": "Issued" | "Claimed" | "Burnt",
  "metadata": {
    "888": {
      "<policy_id>": {
        "<asset_name>": {
          "name": "<string>",
          "image": <uri | array>,
          "mediaType": image/<mime_sub_type>,
          "description": <string | array>,
          "files": [{
            "name": <string>,
            "mediaType": <mime_type>,
            "src": <uri | array>,
            <other_properties>
          }],
        }
      }
    },
    "version": 1,
  }
}
```

### References

- [CIP-0025: Media Token Metadata Standard](https://github.com/cardano-foundation/CIPs/blob/master/CIP-0025)
- [CIP-0067: Asset Name Label Registry](https://github.com/cardano-foundation/CIPs/blob/master/CIP-0067)
- [CIP-0068: Datum Metadata Standard](https://github.com/cardano-foundation/CIPs/blob/master/CIP-0068)
- [EIP-721: Non-Fungible Token Standard](https://eips.ethereum.org/EIPS/eip-721)
- [EIP-4973: Account-Bound Tokens](https://eips.ethereum.org/EIPS/eip-4973)
- [EIP-5114: Soulbound Badge](https://eips.ethereum.org/EIPS/eip-5114)
- [EIP-5192: Minimal Soulbound NFTs](https://eips.ethereum.org/EIPS/eip-5192)
- [EIP-5484: Consensual Soulbound Tokens](https://eips.ethereum.org/EIPS/eip-5484)
- [EIP-6239: Semantic Soulbound Tokens](https://eips.ethereum.org/EIPS/eip-6239)

## Copyright

This CIP is licensed under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/legalcode).
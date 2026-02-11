import { getAttributeBySlug } from "./ledgerTransform";
import { AttributeItemModelType, isCoordinate } from "./touchAuditData";

export const getWhereIVDTCardProps = (
  attributes?: AttributeItemModelType[],
) => {
  const legalAddressValues = [
    String(
      getAttributeBySlug("ivdt_where_home_full_address", attributes).value,
    ),
    String(
      getAttributeBySlug("ivdt_who_user_location_country", attributes).value,
    ),
  ].filter((value) => value.length > 0);
  const legalAddress =
    legalAddressValues.length > 0 ? legalAddressValues.join(", ") : "-";
  const locationCoordinates = getAttributeBySlug(
    "ivdt_where_home_address_location",
    attributes,
  );

  return {
    legalAddress,
    latitude: isCoordinate(locationCoordinates)
      ? locationCoordinates.value.latitude
      : 0,
    longitude: isCoordinate(locationCoordinates)
      ? locationCoordinates.value.longitude
      : 0,
    isGPSVerified: Boolean(
      getAttributeBySlug("ivdt_where_address_verification_status", attributes)
        .value,
    ),
    isDMVVerified: Boolean(
      getAttributeBySlug(
        "ivdt_where_home_full_address",
        attributes,
      ).metadata?.find(
        (attr) => attr.slug === "ivdt_where_legal_address_dmv_verified",
      )?.value,
    ),
  };
};

export const getWhenIVDTTouchAuditProps = (
  attributes?: AttributeItemModelType[],
) => {
  return {
    blockchain: String(
      getAttributeBySlug("ivdt_when_blockchain", attributes).value,
    ),
    txHash: String(
      getAttributeBySlug("ivdt_when_transaction_hash", attributes).value,
    ),
    status: String(getAttributeBySlug("ivdt_when_status", attributes).value),
    block: String(getAttributeBySlug("ivdt_when_block", attributes).value),
    ownerWalletId: String(
      getAttributeBySlug("ivdt_when_owner_wallet_id", attributes).value,
    ),
    tokenId: String(getAttributeBySlug("ivdt_when_token_id", attributes).value),
    tokenType: String(
      getAttributeBySlug("ivdt_when_token_type", attributes).value,
    ),
  };
};

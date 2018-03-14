# Note this secret has to be same for company-web & company-api in order to make CSRF work
# As FE uses staging ENV for local testing, this should be in sync with Staging API Secret
export COMPANY_SECRET_KEY_BASE='b1f0ff90cd692556f9740a8e609f88f2f4fc15d9dda9035445a7577c3f94936eaae91a0793c4ad5500314fe5a526a3b3f7c7c71c303f883d903df138783a8225'

# Core ENV Details
export CW_SUB_ENV='sandbox'

# Cloudfront details
export CW_CLOUDFRONT_DOMAIN=''

# Company API details
export CW_ROOT_URL='http://developmentost.com:8080/'
export CW_CA_ROOT_URL='http://kit.developmentost.com:8080/'

# Basic Auth credentials
export CW_BASIC_AUTH_USERNAME='ost'
export CW_BASIC_AUTH_PASSWORD='A$F^&n!@$ghf%7'

export CA_REDIS_ENDPOINT="redis://ca:st123@127.0.0.1:6379"
export CW_SK_ADMIN_PW="7BU]K]9Lz)_3ZADr"

# OST Other Product Urls
export COMPANY_KIT_ROOT_URL='http://kit.developmentost.com:8080/'
export COMPANY_KYC_ROOT_URL='http://kyc.developmentost.com:8080/'
export COMPANY_VIEW_ROOT_URL='http://view.developmentost.com:8080/'
export COMPANY_SIMPLE_TOKEN_URL='http://developmentsimpletoken.org:8080/'
export COMPANY_TOKEN_SALE_URL='http://sale.developmentsimpletoken.org:8080/'

# OST.com (token sale account) Pepo Campaigns Account details
export STW_CAMPAIGN_ENCRYPTED_CLIENT_ID='bfda650a78cf3e2d2b1476931cb3c1fb'
export STW_CAMPAIGN_ENCRYPTED_LIST_ID='01bb39c3b883a6e5'

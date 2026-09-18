#!/usr/bin/env bash
if [ -n "$DFU_AIRTABLE_TOKEN" ]; then
  sed -i "s|__DFU_AIRTABLE_TOKEN__|$DFU_AIRTABLE_TOKEN|g" index.html
fi

# Fix Movement Duplication Bugs

- [/] Fix `getAllProducts()` in adminService.ts — filter `movement`/`the-movement` exact IDs from productMetadata loop
- [ ] Fix `ProductsManager.loadProducts()` — skip movement handles during Shopify sync write
- [ ] Fix `migrateStaleEntries()` in cacheService.ts — purge movement from productMetadata, ensure gadgets always has 1 product
- [ ] Fix dashboard gadgets count — ensure collection shows correct product count
- [ ] Verify in browser

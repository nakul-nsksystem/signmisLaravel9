ALTER TABLE `m_delivery_destinations` 
DROP FOREIGN KEY `fk_m_delivery_destinations_delivery_destination_m_customer_id`,
DROP FOREIGN KEY `fk_m_delivery_destinations_m_customer_id`;
ALTER TABLE `m_delivery_destinations` 
ADD CONSTRAINT `fk_m_delivery_destinations_delivery_destination_m_customer_id`
  FOREIGN KEY (`delivery_destination_m_customer_id`)
  REFERENCES `m_customers` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
ADD CONSTRAINT `fk_m_delivery_destinations_m_customer_id`
  FOREIGN KEY (`m_customer_id`)
  REFERENCES `m_customers` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

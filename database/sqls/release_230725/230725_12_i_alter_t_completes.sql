-- INDEX作成
ALTER TABLE t_completes         DROP INDEX id_t_completes_complete_day                      ;
ALTER TABLE t_completes         ADD  INDEX id_t_completes_complete_day (complete_day ASC)   ;
ALTER TABLE t_complete_details  DROP INDEX id_t_complete_details_01                         ;
ALTER TABLE t_complete_details  ADD  INDEX id_t_complete_details_01    (payment_day  ASC)   ;

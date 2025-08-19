/* �������i����������Ă�ꍇ�͕����̔��㊮�������X�V */
UPDATE t_projects p
   SET p.sales_completed_at
     = (/* 3.�������i[���㊮����]���S�Đݒ肳��Ă��邩�m�F */
        SELECT CASE WHEN COUNT(CASE WHEN pd.sales_completed_at IS NULL THEN 1 END) = 0
                    /* �������i[���㊮����]�S�Đݒ肳��Ă���Ε���[���㊮����]�Ɣ�r���đ傫�����̊�������ݒ� */
                    THEN MAX(CASE WHEN pd.sales_completed_at >= IFNULL(p.sales_completed_at, pd.sales_completed_at) 
                                  THEN pd.sales_completed_at 
                                  ELSE p.sales_completed_at
                                  END)
                    /* �������i[���㊮����]1���ł�Null�̏ꍇ�͕���[���㊮����]���Z�b�g */
                    ELSE p.sales_completed_at
                    END AS sales_completed_at
          FROM t_project_products pd
         /* 2.����id���L�[�ɂ���[�폜����ĂȂ�]�������i�������Ɋ܂߂� */
         WHERE pd.t_project_id = p.id
           AND pd.deleted_at IS NULL)
 /* 1.����id�������ɂ��ĕ���id���擾 */
 WHERE p.deleted_at IS NULL
;

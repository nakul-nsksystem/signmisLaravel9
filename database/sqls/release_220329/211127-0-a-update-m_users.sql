UPDATE m_users SET cd =  concat('D',cd )
WHERE deleted_at IS NOT NULL ;
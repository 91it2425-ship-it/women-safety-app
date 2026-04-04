package com.womensafety.repository;

import com.womensafety.model.Alert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, String> {

    Page<Alert> findAllByOrderByTimestampDesc(Pageable pageable);

    List<Alert> findTop10ByOrderByTimestampDesc();
}

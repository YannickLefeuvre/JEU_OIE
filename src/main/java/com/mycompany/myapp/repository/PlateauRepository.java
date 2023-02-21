package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Plateau;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Plateau entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PlateauRepository extends JpaRepository<Plateau, Long> {}
